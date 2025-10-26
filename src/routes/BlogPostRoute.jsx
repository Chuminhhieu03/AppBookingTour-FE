import { lazy } from 'react';
import Loadable from 'components/Loadable';

// Blog Posts Pages
const BlogPostsDefault = Loadable(lazy(() => import('views/BlogPosts/Default')));
const BlogPostsAddnew = Loadable(lazy(() => import('views/BlogPosts/Addnew')));
const BlogPostsDisplay = Loadable(lazy(() => import('views/BlogPosts/Display')));
const BlogPostsEdit = Loadable(lazy(() => import('views/BlogPosts/Edit')));

const BlogPostRoute = {
  path: '/admin/blog',
  children: [
    {
      path: '/admin/blog',
      element: <BlogPostsDefault />
    },
    {
      path: '/admin/blog/addnew',
      element: <BlogPostsAddnew />
    },
    {
      path: '/admin/blog/display/:id',
      element: <BlogPostsDisplay />
    },
    {
      path: '/admin/blog/edit/:id',
      element: <BlogPostsEdit />
    }
  ]
};

export default BlogPostRoute;
