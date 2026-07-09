"use client"
import React, { useState } from 'react'
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
    const {data : products} = useProducts();
    const {data : cartCount} = useCartCount();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const logOuthandle = () => {
        closeMenu();
        logout(undefined, {
            onSuccess: () => {
                openModal();
            },
        });
    }
    const likeCount = products?.filter(product => product.liked).length ?? 0;
    const cartTotal = cartCount?.data?.length ?? 0;

    // 찜/장바구니/마이페이지/로그아웃 — 데스크톱 nav와 모바일 드로어 리스트에서 공통으로 씀
    const navLinks = (
        <>
            <li className="nav_link like_link">
                <Link href="/like" onClick={closeMenu}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                    <span>찜</span>
                    {likeCount > 0 && <span className="count_badge">{likeCount}</span>}
                </Link>
            </li>
            <li className="nav_link">
                <Link href="/cart" onClick={closeMenu}>
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
                <li className="nav_link mypage_link">
                    <Link href="/mypage" onClick={closeMenu}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>마이페이지</span>
                    </Link>
                </li>
            )}
            {isLoggedIn && <li className="logout_btn" onClick={logOuthandle}>로그아웃</li>}
        </>
    );

  return (
    <>
        <div className="top_bar"></div>
        <header className="header">
            <div className="inner">
                <Link href="/" onClick={closeMenu}>
                    <h2><Image src="/logo.png" alt="logo" width={100} height={60}></Image></h2>
                </Link>

                <ul className="nav">
                    {navLinks}
                    {isLoggedIn && userName && (
                        <li className="user_badge">
                            <Link href="/mypage" onClick={closeMenu}>{`${userName}님`}</Link>
                        </li>
                    )}
                </ul>

                <button
                    type="button"
                    className={`menu_toggle ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="메뉴 열기"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {menuOpen && <div className="menu_overlay" onClick={closeMenu} />}
            <div className={`nav_mobile ${menuOpen ? "open" : ""}`}>
                <div className="drawer_head">
                    {isLoggedIn && userName && (
                        <Link href="/mypage" onClick={closeMenu} className="drawer_user">
                            {`${userName}님`}
                        </Link>
                    )}
                </div>
                <ul className="drawer_list">
                    {navLinks}
                </ul>
            </div>
        </header>
    </>
  )
}
