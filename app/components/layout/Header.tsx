"use client"
import React from 'react'
import Link from 'next/link'
import Image from "next/image";
import "./Header.css";
import { useModalStore } from '@/app/store/modalStore';
import useAuthCheck from '@/app/hooks/useAuthCheck';
import useLogout from '@/app/hooks/useLogout';
import { useAuthStore } from '@/app/store/authStore';
import { useProducts } from '@/app/hooks/useProducts';
import { useCartCount } from '@/app/hooks/useCart';


export default function Header() {
    const { isSuccess: isLoggedIn } = useAuthCheck();
    const openModal = useModalStore(state => state.openLoginModal);
    const { mutate: logout } = useLogout();
    const userName = useAuthStore(state => state.user?.name);
    const {data : products, isLoading, isError} = useProducts();
    const {data : cartCount, isLoading : cartCountLoading, isError : cartCountError} = useCartCount();
    const logOuthandle = () => {
        logout(undefined, {
            onSuccess: () => {
                openModal();
            },
        });
    }
    const likeCount = products?.filter(product => product.liked).length ?? 0;
    const cartTotal = cartCount?.data?.length ?? 0;
  return (
    <>
        <div className="top_bar"></div>
        <header className="header">
            <div className="inner">
                <Link href="/">
                    <h2><Image src="/logo.png" alt="logo" width={100} height={60}></Image></h2>
                </Link>
                <ul className="nav">
                    <li className="nav_link like_link">
                        <Link href="/like">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                            </svg>
                            <span>찜</span>
                            {likeCount > 0 && <span className="count_badge">{likeCount}</span>}
                        </Link>
                    </li>
                    <li className="nav_link">
                        <Link href="/cart">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                            </svg>
                            <span>장바구니</span>
                            {cartTotal > 0 && <span className="count_badge">{cartTotal}</span>}
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <li className="nav_link">
                            <Link href="/orders">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="8" y1="13" x2="16" y2="13" />
                                    <line x1="8" y1="17" x2="16" y2="17" />
                                </svg>
                                <span>주문내역</span>
                            </Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li className="nav_link">
                            <Link href="/my-reviews">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21.4 8 14 2 9.4h7.6z" />
                                </svg>
                                <span>내 리뷰</span>
                            </Link>
                        </li>
                    )}
                    {isLoggedIn && userName && <li className="user_badge">{`${userName}님`}</li>}
                    {isLoggedIn && <li className="logout_btn" onClick={logOuthandle}>로그아웃</li>}
                </ul>
            </div>
        </header>
    </>
  )
}
