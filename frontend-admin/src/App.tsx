import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { RestaurantList } from './pages/RestaurantList'
import { AdminLayout } from './components/Layout/AdminLayout'

function App() {
    const isAuthenticated = !!localStorage.getItem('admin_token')

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <AdminLayout>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/restaurants" replace />} />
                                    <Route path="/restaurants" element={<RestaurantList />} />
                                </Routes>
                            </AdminLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
