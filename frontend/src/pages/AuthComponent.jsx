import React, { useState, useEffect } from 'react';



const Notification = ({ message, type, onclose }) => {
  if (!message) return null;
  const baseClasses = "fixed top-5 right-5 w-auto max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center z-50 transition-all duration-300";
  const typeClasses = {
    success: "bg-green-500/80 backdrop-blur-sm border border-green-400",
    error: "bg-red-500/80 backdrop-blur-sm border border-red-400",
  };
  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className="mr-3">{type === 'success' ? '✅' : '❌'}</span>
      <p className="flex-grow">{message}</p>
      <button onClick={onclose} className="ml-4 text-xl font-bold">&times;</button>
    </div>
  );
};

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: null });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  const showNotification = (message, type, duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, duration);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: null, type: null });


    let action = isLogin ? 'login' : 'register';
    let payload = { action };

    if (showForgotPassword) {
      showNotification("ฟังก์ชันลืมรหัสผ่านยังไม่เปิดใช้งาน", "error");
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      payload.email = formData.email;
      payload.password = formData.password;
    } else { // Register
      if (formData.password !== formData.confirmPassword) {
        showNotification("รหัสผ่านไม่ตรงกัน", "error");
        setIsLoading(false);
        return;
      }
      payload.username = formData.username;
      payload.email = formData.email;
      payload.password = formData.password;
    }

    try {
      console.log('Sending payload:', payload);
      

      const response = await fetch('/auth_handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const textResult = await response.text();
      console.log('Raw response:', textResult);
      
      let result;
      try {
        result = JSON.parse(textResult);
        console.log('Parsed result:', result);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error(`Server returned invalid JSON: ${textResult.substring(0, 200)}...`);
      }
      
      if (result.success) {
        showNotification(result.message, "success");
        if (action === 'login') {
          if (formData.rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          localStorage.setItem('user', JSON.stringify(result.data.user));
          console.log('Login successful, user data:', result.data.user);
        } else {
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '', confirmPassword: '', rememberMe: false });
        }
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error('Auth error:', error);
      showNotification(`ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = '/google_auth.php';
  };

  const resetFormAndState = () => {
    setFormData({ username: '', email: '', password: '', confirmPassword: '', rememberMe: false });
    setNotification({ message: null, type: null });
    setShowForgotPassword(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    resetFormAndState();
  };

  const switchToRegister = () => {
    setIsLogin(false);
    resetFormAndState();
  };

  const switchToForgotPassword = () => {
    setShowForgotPassword(true);
    setIsLogin(true);
  };

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onclose={() => setNotification({ message: null, type: null })}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {showForgotPassword ? 'รีเซ็ตรหัสผ่าน' : 
                 isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชีใหม่'}
              </h2>
              <p className="text-gray-600">
                {showForgotPassword ? 'กรอกอีเมลเพื่อรีเซ็ตรหัสผ่าน' :
                 isLogin ? 'ยินดีต้อนรับกลับมา!' : 'เริ่มต้นใช้งานกับเรา'}
              </p>
            </div>

            {!showForgotPassword && (
              <div className="mt-8">
                <button
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            )}

            {!showForgotPassword && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">หรือ</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {!isLogin && !showForgotPassword && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อผู้ใช้
                  </label>
                  <input 
                    id="username" name="username" type="text" 
                    required={!isLogin && !showForgotPassword} 
                    value={formData.username} onChange={handleInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="ชื่อผู้ใช้" 
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input 
                  id="email" name="email" type="email" required 
                  value={formData.email} onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="example@gmail.com" 
                />
              </div>

              {!showForgotPassword && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      รหัสผ่าน
                    </label>
                    <input 
                      id="password" name="password" type="password" required 
                      value={formData.password} onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="รหัสผ่าน" 
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        ยืนยันรหัสผ่าน
                      </label>
                      <input 
                        id="confirmPassword" name="confirmPassword" type="password" 
                        required={!isLogin} 
                        value={formData.confirmPassword} onChange={handleInputChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="ยืนยันรหัสผ่าน" 
                      />
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="rememberMe" name="rememberMe" type="checkbox"
                          checked={formData.rememberMe} onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                          จดจำรหัสผ่าน
                        </label>
                      </div>
                      <button
                        type="button" onClick={switchToForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                      >
                        ลืมรหัสผ่าน?
                      </button>
                    </div>
                  )}
                </>
              )}
              
              <button
                type="submit" disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
              >
                {isLoading ? 'กำลังประมวลผล...' : 
                 showForgotPassword ? 'ส่งลิงก์รีเซ็ต' :
                 isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
              </button>
            </form>

            <div className="mt-6 text-center">
              {showForgotPassword ? (
                <p className="text-sm text-gray-600">
                  จำรหัสผ่านได้แล้ว?
                  <button
                    onClick={switchToLogin}
                    className="ml-1 font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                  >
                    เข้าสู่ระบบ
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'}
                  <button
                    onClick={isLogin ? switchToRegister : switchToLogin}
                    className="ml-1 font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                  >
                    {isLogin ? 'สร้างบัญชีใหม่' : 'เข้าสู่ระบบ'}
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthComponent;