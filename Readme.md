# Cloudfront Lambda Redirect

This service is a simple Lambda@Edge function for Cloudfront. It takes a request and conditionally rewrites the uri to direct requests to the `./index.html` file contained within the directory specified by the uri.

## Examples

| URI                   | Redirected To                   |
| --------------------- | ------------------------------- |
| `/blog/categories`    | `/blog/categories/index.html`   |
| `/blog/my-blog-post/` | `/blog/my-blog-post/index.html` |
| `/images/splash.jpeg` | `/images/splash.jpeg`           |

Paths to specific images remain unchanged, but directory-like paths are redirected to the associated index.html file.

## Motivation

For Gatsby websites rewriting requests makes them faster and better for search engines like Google.

Without a rewrites

| Step | Layer      | Action                                             |
| :--: | ---------- | -------------------------------------------------- |
|  1   | Browser    | Request `/blog/my-blog-post`                       |
|  2   | Cloudfront | Pass request to s3 unchanged                       |
|  4   | S3         | raise 404 not found error                          |
|  5   | S3         | Return 404 error page: `/index.html` (Gatsby root) |
|  6   | Browser    | Load Gatsby/React app                              |
|  7   | Gatsby     | Process route `/blog/my-blog-post`                 |
|  8   | Gatsby     | Render page                                        |

Without rewrites Gatsby has to process the route and render the result, rather than simply returning the pre-rendered page.

With Rewrites

| Step | Layer      | Action                                             |
| :--: | ---------- | -------------------------------------------------- |
|  1   | Browser    | Request `/blog/my-blog-post`                       |
|  2   | Cloudfront | Rewrite request to `/blog/my-blog-post/index.html` |
|  3   | S3         | Return `/blog/my-blog-post/index.html`             |
|  4   | Browser    | Display prebuilt page                              |

As you can see the rewrite allows the browser to render the results directly, rather than rely on the Gatsby/React frontend to manipulate the DOM to display the requested page.

This makes a big difference for search bots. The Google bot does process JavaScript and render React Apps. However, it often does not capture content in these cases. This happens because the bot does not wait very long to process the page, so if your app does not render content promptly, it will look like an empty page to Google.

Rewriting the request to return the pre-built html page fixes this issue. The server returns the pre-rendered page, so the content is available as soon as the Google bot retrieves the page.
