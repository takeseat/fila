import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Play, 
  Sparkles, 
  ChevronRight, 
  Smartphone, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  X,
  Menu,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Entrada Rápida",
      description: "O cliente escaneia um QR Code na entrada ou a recepção registra o nome e telefone dele no tablet em menos de 5 segundos.",
      icon: <Smartphone className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "2. Acompanhamento em Tempo Real",
      description: "O cliente recebe uma mensagem automática no WhatsApp com um link exclusivo para acompanhar sua posição na fila, sem precisar ficar esperando na porta.",
      icon: <MessageSquare className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "3. Chamada Inteligente",
      description: "Quando a mesa está pronta, a recepção clica em chamar. O cliente recebe um aviso no WhatsApp solicitando o retorno imediato. Prático, silencioso e sem stress.",
      icon: <Check className="w-6 h-6 text-indigo-400" />
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate contact message
    alert("Mensagem enviada com sucesso! Um especialista entrará em contato em breve.");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#0b1c30] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0"></div>
      
      {/* Glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header / Navigation */}
      <nav className="sticky top-0 w-full z-50 glass border-b border-[#213145]/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <a href="#" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent font-display">
                TakeSeat
              </span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Como Funciona</a>
              <a href="#recursos" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Recursos</a>
              <a href="#planos" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Planos</a>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="https://app.takeseat.me/login" 
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Entrar
            </a>
            <a 
              href="https://app.takeseat.me/register" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-200 scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              Começar agora
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-b border-[#213145] px-6 py-6 space-y-4 absolute top-20 left-0 w-full z-40 flex flex-col">
            <a 
              href="#como-funciona" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
            >
              Como Funciona
            </a>
            <a 
              href="#recursos" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
            >
              Recursos
            </a>
            <a 
              href="#planos" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
            >
              Planos
            </a>
            <hr className="border-[#213145]" />
            <div className="flex flex-col gap-3">
              <a 
                href="https://app.takeseat.me/login"
                className="text-center font-semibold text-slate-300 hover:text-white py-2.5 rounded-lg border border-[#213145]"
              >
                Entrar
              </a>
              <a 
                href="https://app.takeseat.me/register"
                className="text-center bg-indigo-600 text-white font-semibold py-2.5 rounded-lg border border-indigo-500/30"
              >
                Começar agora
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 z-10 max-w-7xl mx-auto px-6 md:px-12 w-full space-y-32 md:space-y-48">
        
        {/* Hero Section */}
        <section className="pt-16 md:pt-24 pb-12 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full border border-indigo-500/20 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teste grátis por 7 dias no plano Flow</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
              Restaurantes cheios merecem uma recepção à altura.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
              Transforme filas caóticas em experiências premium de atendimento. Evite desistências silenciosas, retenha seus clientes e aumente o faturamento com uma gestão inteligente e elegante.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="https://app.takeseat.me/register" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Começar teste grátis</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#como-funciona" 
                className="bg-[#131b2e] hover:bg-[#1a253f] text-slate-200 font-semibold px-8 py-4 rounded-xl border border-[#213145] transition-all flex items-center justify-center gap-2 scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Ver como funciona</span>
                <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              </a>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/5 rounded-2xl blur-3xl -z-10"></div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
              <img 
                src="/images/hero-app.jpg" 
                alt="TakeSeat Painel Operacional" 
                className="rounded-2xl shadow-2xl border border-[#213145] object-cover w-full h-[320px] sm:h-[420px] md:h-[500px]"
              />
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-8 bg-gradient-to-r from-[#131b2e] to-[#1e293b] rounded-2xl border border-[#213145]/80 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3.5 py-1 rounded-full border border-rose-500/20 text-xs font-semibold uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>O gargalo invisível</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
              Sua fila de espera está te fazendo perder dinheiro.
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light">
              Anotar nomes em papel gera aglomerações desconfortáveis na porta e faz com que muitos clientes desistam silenciosamente sem que você perceba. O TakeSeat profissionaliza o primeiro ponto de contato com o seu cliente.
            </p>
          </div>
        </section>

        {/* Solution Flow (Interactive timeline) */}
        <section id="como-funciona" className="py-8 space-y-16 scroll-mt-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
              Uma fila organizada, sem esforço
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto font-light">
              Ofereça uma experiência premium e digital do momento em que o cliente chega até a hora de se sentar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                  activeStep === idx 
                    ? 'bg-[#131b2e] border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)]' 
                    : 'bg-[#131b2e]/40 border-[#213145]/60 hover:border-slate-700/60'
                }`}
                onMouseEnter={() => setActiveStep(idx)}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    activeStep === idx ? 'bg-indigo-600/30' : 'bg-[#1e293b]'
                  }`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
                
                <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                  <span>Saiba mais</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Details */}
        <section id="recursos" className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center scroll-mt-24">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display leading-tight">
              Tudo sob controle. Em tempo real.
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              Desenvolvemos uma plataforma rápida e simples para a equipe da recepção gerenciar a fila com precisão, liberando tempo para focar na hospitalidade.
            </p>
            
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white font-display">Tempo Estimado de Espera (ETA)</h4>
                  <p className="text-sm text-slate-300 font-light mt-1">Estimativa de tempo calculada dinamicamente com base no comportamento recente para alinhar expectativas.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white font-display">Comunicação Direta por WhatsApp</h4>
                  <p className="text-sm text-slate-300 font-light mt-1">Sem aparelhos vibratórios caros ou chamadas em voz alta. O cliente recebe avisos e atualizações direto no celular.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white font-display">Painel de Analíticos & Insights</h4>
                  <p className="text-sm text-slate-300 font-light mt-1">Identifique horários de pico, tempo de retenção médio e taxa de desistência para dimensionar a equipe.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="relative w-full">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-3xl -z-10"></div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
              <img 
                src="/images/restaurant.jpg" 
                alt="Alta Gastronomia Restaurante" 
                className="rounded-2xl shadow-xl border border-[#213145] object-cover w-full h-[380px] md:h-[450px]"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planos" className="py-8 scroll-mt-24">
          <div className="bg-[#131b2e] rounded-2xl border border-[#213145]/80 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
                Planos sob medida para o seu negócio
              </h2>
              <p className="text-slate-300 font-light max-w-2xl mx-auto">
                Escolha o plano que melhor atende à estrutura do seu restaurante. Sem taxas de setup e sem taxas ocultas.
              </p>
              
              {/* Toggle Switch */}
              <div className="inline-flex items-center gap-1.5 bg-[#0b1c30] p-1.5 rounded-xl border border-[#213145]">
                <button 
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    !isAnnual 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mensal
                </button>
                <button 
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isAnnual 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Anual</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    -10%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Flow Plan Card */}
              <div className="bg-[#0b1c30] border border-[#213145] rounded-2xl p-8 md:p-10 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 hover:border-slate-700">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white font-display">TakeSeat Flow</h3>
                      <p className="text-xs text-slate-400 mt-1">O controle essencial e digital para a recepção.</p>
                    </div>
                    <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                      7 dias grátis
                    </span>
                  </div>
                  
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-extrabold text-white font-display">
                      {isAnnual ? 'R$ 89' : 'R$ 99'}
                    </span>
                    <span className="text-slate-400 text-sm ml-2">/mês</span>
                  </div>
                  
                  <hr className="border-[#213145]" />
                  
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Fila de espera digital ilimitada</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Notificações automáticas via WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Link de acompanhamento para o cliente</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Painel operacional para recepção</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 pt-4">
                  <a 
                    href="https://app.takeseat.me/register"
                    className="w-full bg-[#131b2e] hover:bg-[#1a253f] text-white font-semibold text-center py-3.5 rounded-xl border border-[#213145] block transition-all hover:border-slate-600"
                  >
                    Testar 7 dias grátis
                  </a>
                </div>
              </div>

              {/* Signature Plan Card */}
              <div className="bg-indigo-950/20 border-2 border-indigo-500/50 rounded-2xl p-8 md:p-10 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl border-l border-b border-indigo-500/30">
                  Premium
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white font-display">TakeSeat Signature</h3>
                    <p className="text-xs text-slate-400 mt-1">A experiência máxima para marcas de alta gastronomia.</p>
                  </div>
                  
                  <div className="flex items-baseline">
                    <span className="text-4xl md:text-5xl font-extrabold text-white font-display">
                      {isAnnual ? 'R$ 249' : 'R$ 259'}
                    </span>
                    <span className="text-slate-400 text-sm ml-2">/mês</span>
                  </div>
                  
                  <hr className="border-[#213145]" />
                  
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-white">Tudo do plano Flow</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-indigo-300">Número WhatsApp exclusivo do seu restaurante</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Personalização total de cores e logotipos</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Métricas de equipe e relatórios consolidados</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>Suporte prioritário via gerente de conta</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center py-3.5 rounded-xl border border-indigo-500/30 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                  >
                    Falar com especialista
                  </button>
                  <a 
                    href="https://app.takeseat.me/register"
                    className="flex-1 bg-[#131b2e] hover:bg-[#1a253f] text-slate-300 font-semibold text-center py-3.5 rounded-xl border border-[#213145] block transition-all"
                  >
                    Começar agora
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 text-center space-y-8 max-w-4xl mx-auto">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-display">Recepção Premium para seu Salão</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight font-display">
            A fila do seu restaurante existe. Organize ela com elegância.
          </h2>
          <p className="text-slate-300 font-light max-w-2xl mx-auto">
            Junte-se às marcas gastronômicas que já utilizam o TakeSeat para oferecer um acolhimento digital superior a seus clientes.
          </p>
          <div className="pt-4">
            <a 
              href="https://app.takeseat.me/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-5 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] text-lg"
            >
              <span>Testar grátis por 7 dias</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#131b2e]/60 border-t border-[#213145]/80 mt-32 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="text-xl font-bold tracking-tight text-white font-display">
              TakeSeat
            </span>
            <span className="text-xs text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} TakeSeat. Gestão inteligente de esperas para alta gastronomia.
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors hover:underline underline-offset-4">Privacidade</a>
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors hover:underline underline-offset-4">Termos de Uso</a>
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors hover:underline underline-offset-4">Status do Sistema</a>
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors hover:underline underline-offset-4">Contato</a>
          </div>
        </div>
      </footer>

      {/* Lead capture modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0b1c30]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-[#131b2e] border border-[#213145] rounded-2xl p-6 md:p-8 shadow-2xl z-10 space-y-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-display">Fale com um especialista</h3>
              <p className="text-sm text-slate-300 font-light">
                Descubra como o plano TakeSeat Signature pode ser personalizado para o volume e identidade do seu restaurante.
              </p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Seu nome</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full bg-[#0b1c30] border border-[#213145] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Nome do restaurante</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Fogo & Luna"
                  className="w-full bg-[#0b1c30] border border-[#213145] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">E-mail corporativo</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="carlos@restaurante.com"
                    className="w-full bg-[#0b1c30] border border-[#213145] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Celular / WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#0b1c30] border border-[#213145] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl border border-indigo-500/30 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] mt-2"
              >
                Enviar solicitação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
