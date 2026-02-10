import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import QuestLog from '@/app/components/rpg/QuestLog'
import NavBar from '@/app/components/NavBar'

export default async function QuestsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar 
        role={session.user.role as 'client' | 'admin'}
        backLink={session.user.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'}
        backText="← Back to Dashboard"
      />
      
      <QuestLog userId={session.user.id} />
    </div>
  )
}
