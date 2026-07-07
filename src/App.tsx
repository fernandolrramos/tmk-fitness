import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { AdminDataProvider } from '@/context/AdminDataContext'
import { BookingProvider } from '@/context/BookingContext'
import { EngagementProvider } from '@/context/EngagementContext'
import { MessagesProvider } from '@/context/MessagesContext'
import { HydrationGate } from '@/components/HydrationGate'
import { RequireRole } from '@/components/RequireRole'
import { MemberLayout } from '@/layouts/MemberLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Auth
import { Login } from '@/pages/Login'

// Member
import { Home } from '@/pages/Home'
import { Schedule } from '@/pages/Schedule'
import { Community } from '@/pages/Community'
import { Bookings } from '@/pages/Bookings'
import { Messages } from '@/pages/Messages'
import { MessageThread } from '@/pages/MessageThread'
import { Profile } from '@/pages/Profile'
import { ClassDetail } from '@/pages/ClassDetail'
import { Trainers } from '@/pages/Trainers'
import { TrainerDetail } from '@/pages/TrainerDetail'
import { Treatment } from '@/pages/Treatment'
import { Membership } from '@/pages/Membership'
import { Contact } from '@/pages/Contact'

// Admin
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { AdminTimetable } from '@/pages/admin/Timetable'
import { AdminBookings } from '@/pages/admin/Bookings'
import { AdminInbox } from '@/pages/admin/Inbox'
import { AdminInboxThread } from '@/pages/admin/InboxThread'
import { AdminMembers } from '@/pages/admin/Members'
import { AdminTrainers } from '@/pages/admin/Trainers'
import { AdminPlans } from '@/pages/admin/Plans'

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminDataProvider>
          <BookingProvider>
            <EngagementProvider>
            <MessagesProvider>
            <HydrationGate>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />

                {/* Member app */}
                <Route
                  element={
                    <RequireRole role="member">
                      <MemberLayout />
                    </RequireRole>
                  }
                >
                  <Route path="/" element={<Home />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/class/:id" element={<ClassDetail />} />
                  <Route path="/trainers" element={<Trainers />} />
                  <Route path="/trainers/:id" element={<TrainerDetail />} />
                  <Route path="/treatment" element={<Treatment />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Full-screen chat thread (own layout, no bottom nav) */}
                <Route
                  path="/messages/:convId"
                  element={
                    <RequireRole role="member">
                      <MessageThread />
                    </RequireRole>
                  }
                />

                {/* Admin console */}
                <Route
                  element={
                    <RequireRole role="admin">
                      <AdminLayout />
                    </RequireRole>
                  }
                >
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/timetable" element={<AdminTimetable />} />
                  <Route path="/admin/bookings" element={<AdminBookings />} />
                  <Route path="/admin/inbox" element={<AdminInbox />} />
                  <Route path="/admin/members" element={<AdminMembers />} />
                  <Route path="/admin/trainers" element={<AdminTrainers />} />
                  <Route path="/admin/plans" element={<AdminPlans />} />
                </Route>

                {/* Full-screen staff chat thread */}
                <Route
                  path="/admin/inbox/:convId"
                  element={
                    <RequireRole role="admin">
                      <AdminInboxThread />
                    </RequireRole>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            </HydrationGate>
            </MessagesProvider>
            </EngagementProvider>
          </BookingProvider>
        </AdminDataProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
