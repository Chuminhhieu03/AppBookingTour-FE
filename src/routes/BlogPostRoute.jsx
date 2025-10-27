import { lazy } from 'react';
import Loadable from 'components/Loadable';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminLayout from '../layout/AdminLayout/AdminLayout';

// Blog Posts Pages
const BlogPostsDefault = Loadable(lazy(() => import('views/BlogPosts/Default')));
const BlogPostsAddnew = Loadable(lazy(() => import('views/BlogPosts/Addnew')));
const BlogPostsDisplay = Loadable(lazy(() => import('views/BlogPosts/Display')));
const BlogPostsEdit = Loadable(lazy(() => import('views/BlogPosts/Edit')));

const BlogPostRoute = {
    path: '/',
    children: [
        {
            path: 'admin',
            element: (
                // <ProtectedRoute>
                    <AdminLayout />
                // </ProtectedRoute>
            ),
            children: [
                {
                    path: '/admin/blog',
                    children: [
                        {
                            index: true,
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
                }
            ]
        }
    ]
};

export default BlogPostRoute;
