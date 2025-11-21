import blogAPI from "api/blog/blogAPI";
import blog from "layout/AdminLayout/Drawer/DrawerItems/Blog";
import { useEffect, useState } from "react";

const BlogSection = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const res = await blogAPI.getRandomBlog();
                setBlogPosts(res.data || []);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };
        fetchBlogPosts();
    }
    , []);

    return (
        <div style={{ padding: '60px 8%' }}>
            <h2
                style={{
                    fontWeight: 'bold',
                    color: '#004E9A',
                    marginBottom: 16
                }}
            >
                KHÁM PHÁ BLOG DU LỊCH VIỆT NAM
            </h2>
            <div
                style={{
                    width: 200,
                    height: 4,
                    backgroundColor: '#004E9A',
                    borderRadius: 4,
                    marginBottom: 20
                }}
            ></div>
            <p style={{ fontSize: 17, lineHeight: 1.6 }}>
                Khám phá những bài viết du lịch hấp dẫn nhất về Việt Nam, từ trải nghiệm thực tế, mẹo du lịch, địa điểm nổi bật đến văn hóa
                bản địa. Mang đến cho bạn góc nhìn chân thực và truyền cảm hứng cho mọi hành trình khám phá.
            </p>

            {/* Vùng ảnh 3 cột */}
            <div className="row mt-4">
                {/* 1. TOUR CARAVAN */}
                {blogPosts.map((post) => (
                <div className="col-md-4 mb-4">
                    <a href="/tour-caravan" style={{ textDecoration: 'none' }}>
                        <div className="position-relative">
                            <img
                                src={post.coverImage}
                                className="img-fluid rounded shadow"
                                style={{ height: 260, objectFit: 'cover', width: '100%' }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.45)',
                                    color: 'white',
                                    padding: '10px 14px',
                                    fontWeight: '600',
                                    borderRadius: '0 0 10px 10px'
                                }}
                            >
                                {post.title}
                            </div>
                        </div>
                    </a>
                </div>
                ))}
            </div>
        </div>
    );
};

export default BlogSection;