import Navbar from '@/sections/Navbar'
import Hero from '@/sections/Hero'
import WorkflowMap from '@/sections/WorkflowMap'
import DecisionsExplorer from '@/sections/DecisionsExplorer'
import Principles from '@/sections/Principles'
import { Roles, Glossary } from '@/sections/RolesGlossary'
import { TestPackages, FutureTopics } from '@/sections/TestsFuture'
import Footer from '@/sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-cairo">
      <Navbar />
      <main>
        <Hero />
        <WorkflowMap />
        <DecisionsExplorer />
        <Principles />
        <Roles />
        <Glossary />
        <TestPackages />
        <FutureTopics />
      </main>
      <Footer />
    </div>
  )
}
