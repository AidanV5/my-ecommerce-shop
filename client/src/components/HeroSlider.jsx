import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSlider = () => {
    const slides = [
        {
            id: 1,
            title: "Summer Collection 2024",
            subtitle: "Discover the hottest trends of the season.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
            link: "/?category=Fashion"
        },
        {
            id: 2,
            title: "Next Gen Electronics",
            subtitle: "Upgrade your life with the latest tech.",
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
            link: "/?category=Electronics"
        },
        {
            id: 3,
            title: "Premium Accessories",
            subtitle: "The perfect finishing touch for any outfit.",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
            link: "/?category=Accessories"
        }
    ];

    return (
        <div style={{ marginBottom: '3rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
                style={{ height: '400px' }}
            >
                {slides.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '5rem'
                            }}>
                                <div style={{ color: 'white', maxWidth: '500px' }}>
                                    <h2 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', fontWeight: '800', lineHeight: 1.1 }}>{slide.title}</h2>
                                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>{slide.subtitle}</p>
                                    <Link to={slide.link} className="btn" style={{
                                        backgroundColor: 'white',
                                        color: '#1e293b',
                                        padding: '0.75rem 2rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        display: 'inline-block'
                                    }}>
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;
