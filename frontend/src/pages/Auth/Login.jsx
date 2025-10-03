

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage({ onSuccessRedirect = '/dashboard' }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function validate() {
        if (!email) return 'Vui lòng nhập email.';
        // simple email regex
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
        if (!re.test(email)) return 'Email không hợp lệ.';
        if (!password) return 'Vui lòng nhập mật khẩu.';
        if (password.length < 6) return 'Mật khẩu phải nhiều hơn 6 ký tự.';
        return '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setLoading(true);
        try {
            // Example fetch to backend - change URL and body as needed
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, remember }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || 'Đăng nhập thất bại.');
                setLoading(false);
                return;
            }
            // on success - store token if provided
            if (data?.token) {
                localStorage.setItem('token', data.token);
            }
            // redirect or call callback
            window.location.href = onSuccessRedirect;
        } catch (err) {
            console.error(err);
            setError('Lỗi kết nối. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đăng nhập vào tài khoản</h2>
                        <p className="mt-2 text-sm text-gray-600">Nhập email và mật khẩu của bạn để tiếp tục</p>
                    </div>
                </motion.div>

                <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value={remember ? 'true' : 'false'} />

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                name="remember_me"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Ghi nhớ tôi</label>
                        </div>

                        <div className="text-sm">
                            <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">Quên mật khẩu?</a>
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', color: 'white' }}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </div>

                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục bằng</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button type="button" className="w-full inline-flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium hover:bg-gray-50">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.3c0-.7-.1-1.4-.3-2H12v3.8h5.5c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.8-4.1 2.8-6.9z" fill="#4285F4" /><path d="M12 22c2.7 0 4.9-.9 6.5-2.5l-3.1-2.4c-.9.6-2.1.9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6C4.7 19.8 8.1 22 12 22z" fill="#34A853" /><path d="M6.4 13.9c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1V7.1H3.1C2 8.9 1.4 10.9 1.4 13s.6 4.1 1.7 5.9l3.3-2z" fill="#FBBC05" /><path d="M12 4.6c1.4 0 2.5.5 3.3 1.4l2.5-2.5C16.9 2 14.7 1 12 1 8.1 1 4.7 3.2 3.1 6.6l3.3 2.5C7.2 6.3 9.4 4.6 12 4.6z" fill="#EA4335" /></svg>
                                Google
                            </button>

                            <button type="button" className="w-full inline-flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium hover:bg-gray-50">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12s4.5 10 10 10 10-4.5 10-10zM8.3 16.7V7.3L16 12l-7.7 4.7z" /></svg>
                                GitHub
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600">Chưa có tài khoản? <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Đăng ký</a></p>
                </form>

                <p className="text-xs text-center text-gray-400">© {new Date().getFullYear()} Your Company. Bảo mật và điều khoản áp dụng.</p>
            </div>
        </div>
    );
}
