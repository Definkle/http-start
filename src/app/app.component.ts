import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { PostService } from "./post.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
        console.log(error);
      }
    );
  }

  onCreatePost(postData: Post) {
    this.postService
      .createAndStorePost(postData.title, postData.content)
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.fetchPosts();
        },
        (error) => {
          this.error = error.message;
        }
      );
  }

  deletePosts() {
    this.postService.deletePosts().subscribe(
      (responseData) => {
        this.loadedPosts = [];
      },
      (error) => {
        this.error = error.message;
      }
    );
  }

  handleError() {
    this.error = null;
  }
}
