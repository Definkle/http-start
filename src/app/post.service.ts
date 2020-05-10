import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from "@angular/common/http";
import { map, catchError, tap } from "rxjs/operators";
import { Post } from "./post.model";
import { Subject, throwError } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty");
    searchParams = searchParams.append("custom", "key");
    return this.http
      .get<{ [key: string]: Post }>(
        "https://ng-learning-23b9a.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({ "Custom-Header": "Hello" }),
          params: searchParams,
          responseType: "json",
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    return this.http.post<{ name: string }>(
      "https://ng-learning-23b9a.firebaseio.com/posts.json",
      postData,
      {
        observe: "response",
      }
    );
  }

  deletePosts() {
    return this.http
      .delete("https://ng-learning-23b9a.firebaseio.com/posts.json", {
        observe: "events",
        responseType: "text",
      })
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Sent) {
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
