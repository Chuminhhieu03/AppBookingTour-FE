const blog = {
    id: 'blog',
    title: 'Blog',
    type: 'group',
    children: [
        {
            id: 'blog-posts',
            title: 'Blog Posts',
            type: 'item',
            icon: <i className="ph ph-article" />,
            url: '/admin/blog'
        }
    ]
};

export default blog;
