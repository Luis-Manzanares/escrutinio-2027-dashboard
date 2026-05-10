import { useState, useEffect } from 'react';
import {
  CheckCircle,
  LayoutDashboard,
  FileText,
  Zap,
  BarChart3,
  Settings,
  Search,
  Palette,
  Activity,
  ZapIcon,
  AlertTriangle,
  Plus
} from 'lucide-react';
import './index.css';

const MOCK_ACTAS = [
  { id: '#ACTA-55901', depto: 'San Salvador', centro: 'Centro Escolar España', dui: '05129483-2', status: 'Validada' },
  { id: '#ACTA-55902', depto: 'Santa Ana', centro: 'Instituto Nacional de Occidente', dui: '04882190-5', status: 'En Revisión' },
  { id: '#ACTA-55903', depto: 'San Miguel', centro: 'Alcaldía Municipal', dui: '03991022-1', status: 'Validada' },
  { id: '#ACTA-55904', depto: 'La Libertad', centro: 'Complejo Educativo Santa Tecla', dui: '06112344-8', status: 'Observada' },
  { id: '#ACTA-55905', depto: 'Usulután', centro: 'Escuela Nacional El Carmen', dui: '07234561-3', status: 'Validada' },
  { id: '#ACTA-55906', depto: 'Sonsonate', centro: 'Centro Escolar Izalco', dui: '08451230-7', status: 'Observada' }
];

export default function App() {
  const [colorblind, setColorblind] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (colorblind) {
      document.body.classList.add('colorblind-mode');
    } else {
      document.body.classList.remove('colorblind-mode');
    }
  }, [colorblind]);

  const filteredActas = MOCK_ACTAS.filter(acta => {
    const matchesFilter = filter === 'all' || acta.status === filter;
    const matchesSearch = acta.id.toLowerCase().includes(search.toLowerCase()) || 
                          acta.dui.includes(search);
    return matchesFilter && matchesSearch;
  });

  const renderBadge = (status: string) => {
    if (status === 'Validada') return <span className="status-badge bg-success">{status}</span>;
    if (status === 'En Revisión') return <span className="status-badge bg-warning">{status}</span>;
    return <span className="status-badge bg-error">{status}</span>;
  };

  const renderAction = (status: string) => {
    if (status === 'Validada') return 'Revisar';
    if (status === 'En Revisión') return 'Corregir';
    return 'Ver Notas';
  };

  return (
    <>
      <nav className="sidebar" aria-label="Navegación principal">
        <div className="logo">
          <CheckCircle size={26} strokeWidth={2.5} />
          <span>ESCRUTINIO 2027</span>
        </div>
        <ul className="nav-links">
          <li><a href="#dashboard" className="nav-link active"><LayoutDashboard size={18} /><span>Dashboard</span></a></li>
          <li><a href="#actas" className="nav-link"><FileText size={18} /><span>Mis Actas</span></a></li>
          <li><a href="#ingreso" className="nav-link"><Zap size={18} /><span>Ingreso Rápido</span></a></li>
          <li><a href="#reportes" className="nav-link"><BarChart3 size={18} /><span>Reportes</span></a></li>
          <li><a href="#ajustes" className="nav-link"><Settings size={18} /><span>Ajustes</span></a></li>
        </ul>
        <div className="sidebar-footer">
          <span className="dot-online"></span>
          <span className="conn-text">Servidor Central</span>
        </div>
      </nav>

      <main className="main-wrapper" id="dashboard">
        <header>
          <div className="search-box">
            <Search size={16} />
            <input 
              type="search" 
              placeholder="Buscar por N° de Acta o DUI del Digitador…" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="controls">
            <button 
              className={`toggle-btn ${colorblind ? 'active' : ''}`}
              onClick={() => setColorblind(!colorblind)}
            >
              <Palette size={14} strokeWidth={2.5} />
              Modo Daltónico
            </button>
            <div className="profile-chip">
              <div className="avatar">D</div>
              <div className="profile-info">
                <p className="user-name">Digitador_042</p>
                <p className="user-role">Sede Central · Turno A</p>
              </div>
            </div>
          </div>
        </header>

        <section className="progress-section">
          <div className="progress-label">
            <span>Progreso de Escrutinio Nacional</span>
            <strong>73%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ '--fill': '73%' } as React.CSSProperties}></div>
          </div>
        </section>

        <section className="bento-grid">
          <article className="stat-card">
            <span className="stat-icon"><Activity size={20} /></span>
            <span className="stat-label">Actas Procesadas (Hoy)</span>
            <span className="stat-val">1240</span>
            <span className="stat-trend positive">↑ 15% sobre la meta diaria</span>
          </article>

          <article className="stat-card">
            <span className="stat-icon"><CheckCircle size={20} /></span>
            <span className="stat-label">Precisión de Digitación</span>
            <span className="stat-value-group">
              <span className="stat-val">99.9</span>
              <span className="badge">Nivel Óptimo</span>
            </span>
          </article>

          <article className="stat-card featured-card">
            <span className="stat-icon light"><ZapIcon size={20} /></span>
            <span className="stat-label">Tiempo Promedio / Acta</span>
            <span className="stat-val">42s</span>
            <span className="stat-subtext">
              <span className="pulse-dot"></span> Sincronizado con Servidor Central
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-icon warn"><AlertTriangle size={20} /></span>
            <span className="stat-label">Pendientes de Corrección</span>
            <span className="stat-val error-val">3</span>
            <span className="stat-trend negative">Requieren revisión</span>
          </article>
        </section>

        <section className="table-area" id="actas">
          <div className="table-header">
            <h2>Últimas Actas Ingresadas</h2>
            <div className="table-controls">
              <select 
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="Validada">Validada</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Observada">Observada</option>
              </select>
              <button className="btn-primary">
                <Plus size={14} strokeWidth={3} />
                Nueva Acta
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>N° Acta</th>
                  <th>Departamento</th>
                  <th>Centro de Votación</th>
                  <th>DUI Digitador</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredActas.length > 0 ? (
                  filteredActas.map((acta, i) => (
                    <tr key={i}>
                      <td className="id-cell">{acta.id}</td>
                      <td>{acta.depto}</td>
                      <td>{acta.centro}</td>
                      <td className="id-cell">{acta.dui}</td>
                      <td>{renderBadge(acta.status)}</td>
                      <td><button className="action-link">{renderAction(acta.status)}</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <p className="empty-state">No se encontraron actas con ese criterio.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
