import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import DetailsIndex from './pages/DetailsIndex'
import DetailPage from './pages/DetailPage'
import ChartsAtlas from './pages/ChartsAtlas'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details" element={<DetailsIndex />} />
      <Route path="/details/:slug" element={<DetailPage />} />
      <Route path="/charts" element={<ChartsAtlas />} />
      <Route path="*" element={<DetailPage />} />
    </Routes>
  )
}
