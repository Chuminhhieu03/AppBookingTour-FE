import { lazy } from 'react';
import Loadable from 'components/Loadable';
import CustomerLayout from 'layout/CustomerLayout/CustomerLayout';

const BlogPostList = Loadable(lazy(() => import('views/Customers/BlogPosts/BlogPostList')));

const BlogPostCustomerRoute = {
    path: '/',
    element: <CustomerLayout />,
    children: [
        {
            path: 'blog-posts',
            element: <BlogPostList />
        }
    ]
};

export default BlogPostCustomerRoute;
