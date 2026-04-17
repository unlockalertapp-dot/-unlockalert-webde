'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore'

const t = {
  fr: {
    tagline: 'Reprends le contrôle de ton attention',
    subtitle: 'Domine tes rivaux. Choisis ton héros.',
    download: '📲 Télécharger l\'app',
    founders: 'Founders',
    leaderboard_title: 'Classement Live',
    today: "Aujourd'hui",
    total: 'Total',
    founder_title: 'Deviens Founder',
    founder_sub: 'Offre limitée aux 2000 premiers',
    founder_btn: '💳 Devenir Founder — 4,99€',
    founder_perks: ['✓ Badge Founder exclusif', '✓ Nom dans les crédits', '✓ Accès anticipé aux features', '✓ Rang spécial leaderboard'],
    founder_count: 'Founders',
    founder_remaining: 'Restantes',
    taps: 'taps',
    online: 'en ligne',
    my_rank: 'Ma position',
    footer: '© 2026 UnlockAlert · Julien Aler',
  },
  en: {
    tagline: 'Take back control of your attention',
    subtitle: 'Dominate your rivals. Choose your hero.',
    download: '📲 Download the app',
    founders: 'Founders',
    leaderboard_title: 'Live Leaderboard',
    today: 'Today',
    total: 'Total',
    founder_title: 'Become a Founder',
    founder_sub: 'Limited to the first 2000',
    founder_btn: '💳 Become Founder — €4.99',
    founder_perks: ['✓ Exclusive Founder badge', '✓ Name in the credits', '✓ Early access to features', '✓ Special leaderboard rank'],
    founder_count: 'Founders',
    founder_remaining: 'Remaining',
    taps: 'taps',
    online: 'online',
    my_rank: 'My rank',
    footer: '© 2026 UnlockAlert · Julien Aler',
  }
}

const FOUNDER_LIMIT = 2000

type Lang = 'fr' | 'en'
type LeaderboardEntry = {
  id: string
  displayName: string
  todayUnlocks: number
  totalUnlocks: number
  hero: string
  isOnline: boolean
}

const PURPLE = '#8B5CF6'
const ORANGE = '#F97316'
const BG = '#07010F'
const CARD = 'rgba(255,255,255,0.05)'
const BORDER = 'rgba(255,255,255,0.08)'

export default function Home() {
  const [lang, setLang] = useState<Lang>('fr')
  const [tab, setTab] = useState<'today' | 'total'>('today')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [founderCount, setFounderCount] = useState(0)
  const tx = t[lang]

  useEffect(() => {
    const nav = navigator.language.startsWith('fr') ? 'fr' : 'en'
    setLang(nav as Lang)
  }, [])

  // ✅ Compteur Founder Firebase temps réel
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'launchOffers', 'counters'), snap => {
      if (snap.exists()) {
        setFounderCount(snap.data().founderCount || 0)
      }
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const field = tab === 'today' ? 'todayUnlocks' : 'totalUnlocks'
    const q = query(collection(db, 'users'), orderBy(field, 'desc'), limit(10))
    const unsub = onSnapshot(q, snap => {
      setLeaderboard(snap.docs.map(d => ({
        id: d.id,
        displayName: d.data().displayName || 'Anonyme',
        todayUnlocks: d.data().todayUnlocks || 0,
        totalUnlocks: d.data().totalUnlocks || 0,
        hero: d.data().selectedHero || 'NLOCK',
        isOnline: d.data().isOnline || false,
      })))
    })
    return () => unsub()
  }, [tab])

  const grad = `linear-gradient(90deg, ${PURPLE}, ${ORANGE})`
  const foundersRemaining = Math.max(0, FOUNDER_LIMIT - founderCount)
  const progress = Math.min(founderCount / FOUNDER_LIMIT, 1)

  return (
    <main style={{ minHeight: '100vh', background: BG, color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontWeight: 900, fontSize: 22, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🔓 UnlockAlert
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['fr', 'en'] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              background: lang === l ? grad : CARD,
              color: 'white',
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🔓</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
          UnlockAlert
        </h1>
        <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{tx.tagline}</p>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>{tx.subtitle}</p>
        <a href="https://play.google.com/store/apps/details?id=com.unlockfr.unlockalert" target="_blank"
          style={{ display: 'inline-block', padding: '16px 40px', borderRadius: 50, background: grad, color: 'white', fontWeight: 800, fontSize: 18, textDecoration: 'none' }}>
          {tx.download}
        </a>
      </section>

      {/* HEROES */}
      <section style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { emoji: '🔷', name: "N'LOCK", desc: lang === 'fr' ? 'Stratège Implacable' : 'Relentless Strategist', color: PURPLE },
            { emoji: '🔶', name: "N'LUCK", desc: lang === 'fr' ? 'Audacieux Imprévisible' : 'Daring Unpredictable', color: ORANGE },
          ].map(h => (
            <div key={h.name} style={{ background: CARD, border: `1px solid ${h.color}44`, borderRadius: 20, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{h.emoji}</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: h.color, marginBottom: 8 }}>{h.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERBOARD */}
      <section style={{ padding: '60px 20px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          🏆 {tx.leaderboard_title}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {(['today', 'total'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 24px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700,
              background: tab === t ? grad : CARD, color: 'white', fontSize: 14,
            }}>{t === 'today' ? tx.today : tx.total}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 40 }}>Chargement...</div>
          ) : leaderboard.map((entry, i) => (
            <div key={entry.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14,
            }}>
              <div style={{ width: 32, textAlign: 'center', fontWeight: 900, fontSize: i < 3 ? 22 : 14, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.4)' }}>
                {i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: entry.hero === 'NLOCK' ? `${PURPLE}33` : `${ORANGE}33`, border: `2px solid ${entry.hero === 'NLOCK' ? PURPLE : ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {entry.hero === 'NLOCK' ? '🔷' : '🔶'}
                </div>
                {entry.isOnline && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: '2px solid #07010F' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{entry.displayName}</div>
                <div style={{ fontSize: 12, color: entry.hero === 'NLOCK' ? PURPLE : ORANGE }}>{entry.hero === 'NLOCK' ? "N'LOCK" : "N'LUCK"}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: 20 }}>{tab === 'today' ? entry.todayUnlocks : entry.totalUnlocks}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{tx.taps}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: CARD, border: `2px solid ${PURPLE}`, borderRadius: 24, padding: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💝</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{tx.founder_title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>{tx.founder_sub}</p>

          {/* ✅ Compteur Firebase temps réel */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE }}>{founderCount}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{tx.founder_count}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: ORANGE }}>{foundersRemaining}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{tx.founder_remaining}</div>
            </div>
          </div>

          {/* Barre de progression */}
          <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: grad, borderRadius: 4, transition: 'width 0.5s ease' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28, textAlign: 'left' }}>
            {tx.founder_perks.map(p => <div key={p} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{p}</div>)}
          </div>
          <a href={process.env.NEXT_PUBLIC_STRIPE_FOUNDER_URL || '#'} target="_blank"
            style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 50, background: grad, color: 'white', fontWeight: 800, textDecoration: 'none', fontSize: 16 }}>
            {tx.founder_btn}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 14, borderTop: `1px solid ${BORDER}` }}>
        <p>{tx.footer}</p>
        <p style={{ marginTop: 8 }}>
          <a href="https://instagram.com/unlockalert" style={{ color: PURPLE, textDecoration: 'none' }}>@unlockalert</a>
        </p>
      </footer>

    </main>
  )
}
