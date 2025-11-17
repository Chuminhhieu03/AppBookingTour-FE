// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
    id: 'pages',
    title: 'Quản lý nhân sự',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Tạo tài khoản cho nhân viên',
            type: 'item',
            icon: <i className="ph ph-lock-key" />
            // children: [
            //     {
            //         id: 'login',
            //         title: 'Login',
            //         type: 'item',
            //         url: '/login',
            //         target: true
            //     },
            //     {
            //         id: 'register',
            //         title: 'Register',
            //         type: 'item',
            //         url: '/register',
            //         target: true
            //     }
            // ]
        }
    ]
};

export default pages;
