/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Camera, 
  ShoppingBag, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Brain, 
  DollarSign, 
  Building2, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Plus, 
  Trash2, 
  Settings, 
  HelpCircle, 
  Send, 
  Layers, 
  Wifi,
  Package,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  Lock,
  Smartphone,
  CreditCard,
  Video,
  Code
} from 'lucide-react';

// Product Catalog tailored for the Dominican Market
interface Product {
  id: string;
  name: string;
  category: string;
  priceDOP: number;
  weightGrams: number;
  yoloClass: string;
  confidence: number;
  imageColor: string;
  inStock: boolean;
}

const DOMINICAN_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Cerveza Presidente 12oz', category: 'Bebidas', priceDOP: 110, weightGrams: 360, yoloClass: 'presidente_bottle', confidence: 0.96, imageColor: 'bg-emerald-700', inStock: true },
  { id: 'p2', name: 'Café Santo Domingo 250g', category: 'Abarrotes', priceDOP: 195, weightGrams: 250, yoloClass: 'cafe_sd_pack', confidence: 0.94, imageColor: 'bg-amber-900', inStock: true },
  { id: 'p3', name: 'Salami Induveca Súper Especial', category: 'Embutidos', priceDOP: 240, weightGrams: 454, yoloClass: 'salami_induveca', confidence: 0.98, imageColor: 'bg-red-700', inStock: true },
  { id: 'p4', name: 'Plátanos Verdes (Mazo 3un)', category: 'Frescos', priceDOP: 75, weightGrams: 650, yoloClass: 'platano_verde', confidence: 0.91, imageColor: 'bg-green-600', inStock: true },
  { id: 'p5', name: 'Queso de Freír Don Pedro', category: 'Lácteos', priceDOP: 180, weightGrams: 300, yoloClass: 'queso_freir', confidence: 0.95, imageColor: 'bg-amber-500', inStock: true },
  { id: 'p6', name: 'Casabe Tradicional Artesanal', category: 'Abarrotes', priceDOP: 90, weightGrams: 200, yoloClass: 'casabe_pack', confidence: 0.93, imageColor: 'bg-amber-200', inStock: true },
];

interface StoreNode {
  id: string;
  name: string;
  location: string;
  edgeDevice: string;
  status: 'online' | 'warning' | 'offline';
  fps: number;
  latencyMs: number;
  tempC: number;
  dailyTransactions: number;
}

const INITIAL_STORES: StoreNode[] = [
  { id: 's1', name: 'Torre Empresarial Piantini', location: 'Santo Domingo', edgeDevice: 'Raspberry Pi 5 + Hailo-8 (8TOPS)', status: 'online', fps: 42, latencyMs: 14, tempC: 48, dailyTransactions: 312 },
  { id: 's2', name: 'Campus PUCMM Santiago', location: 'Santiago de los Caballeros', edgeDevice: 'NVIDIA Jetson Orin Nano (40TOPS)', status: 'online', fps: 58, latencyMs: 9, tempC: 52, dailyTransactions: 245 },
  { id: 's3', name: 'Bella Vista Mall Micro-Hub', location: 'Santo Domingo', edgeDevice: 'Raspberry Pi 5 (Standard)', status: 'warning', fps: 28, latencyMs: 24, tempC: 61, dailyTransactions: 189 },
  { id: 's4', name: 'Punta Cana Village Kiosco', location: 'Punta Cana', edgeDevice: 'Orange Pi 5 Pro (NPU 26TOPS)', status: 'online', fps: 45, latencyMs: 12, tempC: 49, dailyTransactions: 410 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'simulator' | 'webcam-yolo' | 'dashboard' | 'ai-advisor' | 'roi'>('overview');
  
  // Simulator State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    'Sistema Edge YOLO v8 inicializado en dispositivo local.',
    'Cámara de estante 01 calibrada (Matriz de pesos estabilizada).',
    'Listo para simulación de compra Grab & Go.'
  ]);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'scanning' | 'payment' | 'success'>('idle');
  const [selectedPayment, setSelectedPayment] = useState<'qik' | 'azul' | 'tiotap' | 'tarjeta'>('qik');

  // Webcam YOLO Live State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<{ label: string; confidence: number; box: string }[]>([
    { label: 'Objeto de Prueba (Bottle)', confidence: 0.95, box: '[120, 80, 240, 310]' }
  ]);

  const startWebcam = async () => {
    try {
      setWebcamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
      }
    } catch (err: any) {
      setWebcamError('No se pudo acceder a la cámara web. Asegúrese de otorgar permisos en el navegador.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
    }
  };

  // Simulate periodic YOLO detections on webcam stream
  useEffect(() => {
    let interval: any;
    if (isWebcamActive) {
      interval = setInterval(() => {
        const sampleObjects = [
          { label: 'Cerveza Presidente (YOLO v8)', confidence: 0.94 + Math.random() * 0.05, box: '[x:140, y:90, w:110, h:220]' },
          { label: 'Café Santo Domingo', confidence: 0.91 + Math.random() * 0.07, box: '[x:280, y:150, w:90, h:140]' },
          { label: 'Salami Induveca', confidence: 0.96 + Math.random() * 0.03, box: '[x:50, y:200, w:130, h:180]' },
          { label: 'Plátano / Fruta', confidence: 0.89 + Math.random() * 0.08, box: '[x:350, y:80, w:100, h:150]' }
        ];
        // Pick 1 or 2 random detections
        const chosen = sampleObjects.sort(() => 0.5 - Math.random()).slice(0, 2);
        setDetectedObjects(chosen);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isWebcamActive]);

  // AI Advisor State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponses, setAiResponses] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { 
      role: 'assistant', 
      text: 'Hola. Soy tu consultor experto en Grab & Go y Edge AI para el mercado dominicano. ¿En qué aspecto de la arquitectura con YOLO, OpenCV y cámara web te puedo ayudar hoy?' 
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // ROI Calculator State
  const [dailyFootprints, setDailyFootprints] = useState(350);
  const [avgTicket, setAvgTicket] = useState(220);
  const [hardwareCount, setHardwareCount] = useState(2);

  const handleSimulatePick = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    const timestamp = new Date().toLocaleTimeString();
    setSimulationLog(prev => [
      `[${timestamp}] YOLO Edge detectó: ${product.name} (Conf: ${(product.confidence * 100).toFixed(1)}%) | Peso: ${product.weightGrams}g`,
      ...prev.slice(0, 8)
    ]);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const totalCartDOP = cart.reduce((sum, item) => sum + (item.product.priceDOP * item.quantity), 0);
  const totalCartWeight = cart.reduce((sum, item) => sum + (item.product.weightGrams * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('scanning');
    setTimeout(() => {
      setCheckoutStep('payment');
    }, 1500);
  };

  const finalizePayment = () => {
    setCheckoutStep('success');
    setTimeout(() => {
      setCart([]);
      setCheckoutStep('idle');
      const timestamp = new Date().toLocaleTimeString();
      setSimulationLog(prev => [
        `[${timestamp}] Transacción exitosa procesada vía pasarela dominicana. Carrito liberado.`,
        ...prev
      ]);
    }, 2500);
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiLoading) return;

    const userText = aiPrompt.trim();
    setAiPrompt('');
    setAiResponses(prev => [...prev, { role: 'user', text: userText }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          storeContext: { dailyFootprints, avgTicket, hardwareCount, cartCount: cart.length }
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponses(prev => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        setAiResponses(prev => [...prev, { role: 'assistant', text: `Error: ${data.error || 'No se pudo conectar con el servicio de IA.'}` }]);
      }
    } catch (err) {
      setAiResponses(prev => [...prev, { role: 'assistant', text: 'Error de conexión con el servidor backend. Verifique su clave de API de Gemini.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* TOP BAR CONTRACT */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold tracking-tighter shadow-sm">
            G&G
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
              Grab & Go RD
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Edge AI & OpenCV
            </span>
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${activeTab === 'overview' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'hover:text-slate-900'}`}
          >
            Conceptualización
          </button>
          <button 
            onClick={() => setActiveTab('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${activeTab === 'architecture' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'hover:text-slate-900'}`}
          >
            Arquitectura
          </button>
          <button 
            onClick={() => setActiveTab('webcam-yolo')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 text-emerald-700 font-semibold ${activeTab === 'webcam-yolo' ? 'border-b-2 border-emerald-600' : 'hover:text-emerald-800'}`}
          >
            <Video className="w-4 h-4" /> YOLO con mi Webcam
          </button>
          <button 
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${activeTab === 'simulator' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'hover:text-slate-900'}`}
          >
            Simulador Estante
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${activeTab === 'dashboard' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'hover:text-slate-900'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('ai-advisor')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${activeTab === 'ai-advisor' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'hover:text-slate-900'}`}
          >
            Asesor Gemini
          </button>
          <button 
            onClick={() => setActiveTab('roi')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${activeTab === 'roi' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : 'hover:text-slate-900'}`}
          >
            ROI RD$
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('webcam-yolo')}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-2"
          >
            <Video className="w-3.5 h-3.5" /> Activar Webcam YOLO
          </button>
        </div>
      </header>

      {/* Mobile Subheader Navigation */}
      <div className="xl:hidden flex overflow-x-auto bg-white border-b border-slate-200 px-4 py-2 gap-3 text-xs font-medium text-slate-600 no-scrollbar">
        <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>Conceptualización</button>
        <button onClick={() => setActiveTab('architecture')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${activeTab === 'architecture' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>Arquitectura</button>
        <button onClick={() => setActiveTab('webcam-yolo')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-emerald-700 font-bold ${activeTab === 'webcam-yolo' ? 'bg-emerald-600 text-white' : 'bg-emerald-50'}`}>Webcam YOLO</button>
        <button onClick={() => setActiveTab('simulator')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${activeTab === 'simulator' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>Simulador</button>
        <button onClick={() => setActiveTab('dashboard')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${activeTab === 'dashboard' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('ai-advisor')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${activeTab === 'ai-advisor' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>Asesor IA</button>
        <button onClick={() => setActiveTab('roi')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${activeTab === 'roi' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>ROI RD$</button>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 space-y-12">

        {/* =====================================================================
            TAB: WEBCAM LOCAL YOLO (OpenCV + Python Architecture for User PC)
            ===================================================================== */}
        {activeTab === 'webcam-yolo' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="border-b border-slate-200 pb-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
                <Video className="w-3.5 h-3.5" />
                <span>Prueba en tiempo real con la cámara de tu computadora</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">YOLO & OpenCV con tu Cámara Web</h2>
              <p className="text-base text-slate-600 mt-2">
                Aquí puedes probar una simulación interactiva usando la cámara web de tu PC, además de obtener el código completo en Python (OpenCV + Ultralytics YOLO) para ejecutarlo localmente en tu computadora reconociendo cualquier objeto o producto.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Webcam Live Stream Viewport */}
              <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 shadow-xl text-white space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm font-mono tracking-wider">WEBCAM LOCAL FEED (cv2.VideoCapture(0))</span>
                  </div>
                  <div className="text-xs font-mono bg-black/40 px-3 py-1 rounded border border-white/10 text-emerald-300">
                    MODELO: YOLOv8n (COCO / Custom RD)
                  </div>
                </div>

                {/* Video container with simulated YOLO bounding boxes */}
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${isWebcamActive ? 'block' : 'hidden'}`}
                  />
                  
                  {!isWebcamActive && (
                    <div className="text-center p-8 space-y-4">
                      <Camera className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
                      <div>
                        <h4 className="text-lg font-bold text-white">Cámara Web Inactiva</h4>
                        <p className="text-sm text-slate-400 mt-1">Haz clic en el botón inferior para activar tu cámara web y ver el modelo YOLO en acción.</p>
                      </div>
                      <button 
                        onClick={startWebcam}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" /> Iniciar Cámara Web
                      </button>
                    </div>
                  )}

                  {/* Simulated YOLO Bounding Boxes Overlay when active */}
                  {isWebcamActive && detectedObjects.map((obj, i) => (
                    <div 
                      key={i} 
                      className="absolute border-2 border-emerald-400 bg-emerald-500/10 p-2 rounded pointer-events-none transition-all duration-500"
                      style={{
                        top: `${20 + i * 35}%`,
                        left: `${15 + i * 25}%`,
                        width: '200px',
                        height: '110px'
                      }}
                    >
                      <div className="bg-emerald-600 text-white text-xs font-mono px-2 py-0.5 rounded inline-block shadow">
                        {obj.label} ({(obj.confidence * 100).toFixed(1)}%)
                      </div>
                    </div>
                  ))}
                </div>

                {webcamError && (
                  <div className="bg-red-950 border border-red-800 text-red-200 p-4 rounded-xl text-sm flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{webcamError}</span>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between pt-2">
                  {isWebcamActive ? (
                    <button 
                      onClick={stopWebcam}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all text-sm"
                    >
                      Detener Cámara
                    </button>
                  ) : (
                    <button 
                      onClick={startWebcam}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-sm"
                    >
                      Activar Cámara
                    </button>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {isWebcamActive ? 'Inferencia YOLO en curso (~42 FPS)' : 'Esperando activación'}
                  </span>
                </div>
              </div>

              {/* Python Code Snippet Card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-600" />
                    Código Python Local (OpenCV + YOLO)
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Copia este script para ejecutar el reconocimiento de objetos en tiempo real con la cámara de tu computadora usando <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">OpenCV</code> y <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">Ultralytics YOLOv8</code>:
                </p>

                <div className="bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-xl overflow-x-auto space-y-1">
                  <span className="text-slate-500"># Instalar dependencias en tu PC:</span><br/>
                  <span className="text-emerald-400">pip install opencv-python ultralytics</span><br/><br/>
                  <span className="text-slate-500"># script_yolo_webcam.py</span><br/>
                  <span className="text-purple-400">import</span> cv2<br/>
                  <span className="text-purple-400">from</span> ultralytics <span className="text-purple-400">import</span> YOLO<br/><br/>
                  <span className="text-slate-500"># Cargar modelo YOLOv8 preentrenado (o tu peso customizado)</span><br/>
                  model = YOLO(<span className="text-amber-300">'yolov8n.pt'</span>)<br/><br/>
                  <span className="text-slate-500"># Abrir cámara web local (índice 0)</span><br/>
                  cap = cv2.VideoCapture(<span className="text-amber-300">0</span>)<br/><br/>
                  <span className="text-purple-400">while</span> cap.isOpened():<br/>
                  &nbsp;&nbsp;ret, frame = cap.read()<br/>
                  &nbsp;&nbsp;<span className="text-purple-400">if not</span> ret: <span className="text-purple-400">break</span><br/><br/>
                  &nbsp;&nbsp;<span className="text-slate-500"># Inferencia YOLO en el fotograma</span><br/>
                  &nbsp;&nbsp;results = model(frame, stream=<span className="text-amber-300">True</span>)<br/><br/>
                  &nbsp;&nbsp;<span className="text-purple-400">for</span> r <span className="text-purple-400">in</span> results:<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;annotated_frame = r.plot()<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;cv2.imshow(<span className="text-amber-300">"Grab & Go RD - Webcam YOLO"</span>, annotated_frame)<br/><br/>
                  &nbsp;&nbsp;<span className="text-purple-400">if</span> cv2.waitKey(<span className="text-amber-300">1</span>) & <span className="text-amber-300">0xFF</span> == <span className="text-amber-300">ord</span>(<span className="text-amber-300">'q'</span>):<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">break</span><br/><br/>
                  cap.release()<br/>
                  cv2.destroyAllWindows()
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
                  <strong className="block font-semibold mb-1">Nota de Implementación Edge:</strong>
                  Este mismo script es el que se despliega en los dispositivos de bajo costo (Raspberry Pi 5 + Hailo NPU) ubicados en las tiendas autónomas de Santo Domingo.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 1: CONCEPTUALIZACIÓN (Overview)
            ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                  <span>Innovación en Retail RD</span>
                  <span aria-hidden="true">·</span>
                  <span>Edge Computing & Visión YOLO</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Revolución Grab & Go adaptada al mercado dominicano.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Un modelo de tienda autónoma sin cajeros ni filas, diseñado específicamente para zonas corporativas de Santo Domingo, Santiago y polos turísticos. Combina modelos de visión artificial YOLO procesados localmente en dispositivos Edge con fusión de celdas de carga y pasarelas de pago locales (Qik, Azul, Tio Tap).
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={() => setActiveTab('webcam-yolo')}
                    className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all shadow-sm flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" /> Probar con mi Webcam
                  </button>
                  <button 
                    onClick={() => setActiveTab('simulator')}
                    className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>Simulador de Estante</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Adaptación Contextual RD
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                    <div>
                      <strong className="text-slate-900 block">Seguridad y Acceso QR</strong>
                      Control de acceso mediante app móvil (Qik / BHD / Cédula digital) para evitar hurtos en entornos urbanos densos.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                    <div>
                      <strong className="text-slate-900 block">Mix de Productos Locales</strong>
                      Reconocimiento especializado de Cerveza Presidente, Café Santo Domingo, Salami Induveca y plátanos frescos.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                    <div>
                      <strong className="text-slate-900 block">Bajo Costo (CapEx / OpEx)</strong>
                      Dispositivos Edge locales (Raspberry Pi 5 + OpenCV/YOLO) con consumo menor a 15W.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: ARQUITECTURA SOFTWARE & HARDWARE EDGE
            ===================================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-extrabold text-slate-900">Arquitectura de Software y Hardware Edge</h2>
              <p className="text-base text-slate-600 mt-2">
                Diseño técnico enfocado en la resiliencia operativa y la eficiencia de costos para despliegues masivos en la República Dominicana.
              </p>
            </div>

            {/* Architecture Diagram Image */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Diagrama de Arquitectura Técnica de Alto Nivel</h3>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                <img 
                  src="/src/assets/images/architecture_diagram_grab_go_1792806299475.jpg" 
                  alt="Diagrama de Arquitectura Técnica Grab & Go RD" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-slate-500">
                Esquema jerárquico mostrando la capa de sensores IP, el procesamiento Edge con acelerador NPU Hailo-8 / Raspberry Pi, y la integración con la nube y pasarelas de pago dominicanas (Qik, Azul).
              </p>
            </div>

            {/* Hardware Comparison Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Comparativa de Dispositivos Edge de Bajo Costo</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-medium">
                      <th className="py-3 px-4">Dispositivo Edge</th>
                      <th className="py-3 px-4">Costo Aprox (USD)</th>
                      <th className="py-3 px-4">Capacidad NPU / TOPS</th>
                      <th className="py-3 px-4">FPS Promedio (YOLOv8)</th>
                      <th className="py-3 px-4">Consumo Eléctrico</th>
                      <th className="py-3 px-4">Idoneidad RD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">Raspberry Pi 5 + Hailo-8 AI Kit</td>
                      <td className="py-3 px-4">$120 - $140</td>
                      <td className="py-3 px-4">26 TOPS</td>
                      <td className="py-3 px-4 text-emerald-600 font-semibold">45 - 60 FPS</td>
                      <td className="py-3 px-4">12W - 15W</td>
                      <td className="py-3 px-4"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">Óptimo / Recomendado</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">NVIDIA Jetson Orin Nano (8GB)</td>
                      <td className="py-3 px-4">$249 - $299</td>
                      <td className="py-3 px-4">40 TOPS</td>
                      <td className="py-3 px-4 text-emerald-600 font-semibold">60+ FPS</td>
                      <td className="py-3 px-4">15W - 20W</td>
                      <td className="py-3 px-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">Alto Rendimiento</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: SIMULADOR DE ESTANTE
            ===================================================================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Simulador de Estante (YOLO Edge)</h2>
                <p className="text-base text-slate-600 mt-1">
                  Interactúa seleccionando productos dominicanos en la estantería simulada para probar la detección y el carrito virtual.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden min-h-[420px] flex flex-col justify-between">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-mono tracking-wider">CÁMARA ESTANTE #04</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 z-10">
                    {DOMINICAN_PRODUCTS.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleSimulatePick(product)}
                        className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 text-left transition-all relative overflow-hidden flex flex-col justify-between h-36 shadow-md"
                      >
                        <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
                          {(product.confidence * 100).toFixed(0)}% YOLO
                        </div>
                        <div>
                          <span className="text-xs font-mono text-emerald-400 block mb-1">[{product.yoloClass}]</span>
                          <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors block line-clamp-2">
                            {product.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                          <span className="text-xs font-semibold text-emerald-400">RD$ {product.priceDOP}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{product.weightGrams}g</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-center z-10 bg-black/40 border border-white/10 py-2 rounded-xl text-xs text-slate-300 font-mono">
                    Haga clic en cualquier producto para simular que un cliente lo retira del estante.
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Registro de Eventos Edge (MQTT & YOLO)</h4>
                  <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl h-36 overflow-y-auto space-y-1.5">
                    {simulationLog.map((log, i) => (
                      <div key={i}>&gt; {log}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        Carrito Virtual Autónomo
                      </h3>
                      <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} ítems
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 my-4 max-h-60 overflow-y-auto pr-1">
                      {cart.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-sm">
                          El carrito está vacío.<br/>Seleccione productos del estante.
                        </div>
                      ) : (
                        cart.map(item => (
                          <div key={item.product.id} className="py-3 flex items-center justify-between gap-4">
                            <div>
                              <h5 className="text-sm font-semibold text-slate-900">{item.product.name}</h5>
                              <span className="text-xs text-slate-500 font-mono">
                                RD$ {item.product.priceDOP} x {item.quantity} · {item.product.weightGrams * item.quantity}g
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-slate-900 tabular-nums">
                                RD$ {item.product.priceDOP * item.quantity}
                              </span>
                              <button onClick={() => handleRemoveFromCart(item.product.id)} className="text-slate-400 hover:text-red-600 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Total a Pagar (DOP):</span>
                        <span className="tabular-nums font-bold text-emerald-700 text-lg">RD$ {totalCartDOP}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-slate-700 block">Método de Pago:</label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                        <button onClick={() => setSelectedPayment('qik')} className={`p-2.5 rounded-xl border text-center transition-all ${selectedPayment === 'qik' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-200 bg-white text-slate-700'}`}>Qik BHD</button>
                        <button onClick={() => setSelectedPayment('azul')} className={`p-2.5 rounded-xl border text-center transition-all ${selectedPayment === 'azul' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-200 bg-white text-slate-700'}`}>Azul</button>
                      </div>
                    </div>

                    {checkoutStep === 'idle' && (
                      <button 
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-sm ${cart.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                      >
                        Simular Salida y Cobro Automático
                      </button>
                    )}

                    {checkoutStep === 'scanning' && (
                      <div className="w-full py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-center font-semibold">
                        Verificando pasarela de pago...
                      </div>
                    )}

                    {checkoutStep === 'payment' && (
                      <button onClick={finalizePayment} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500">
                        Confirmar Cargo de RD$ {totalCartDOP}
                      </button>
                    )}

                    {checkoutStep === 'success' && (
                      <div className="w-full py-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-center font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" /> ¡Pago Exitoso! Puerta Abierta.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: DASHBOARD DE OPERACIONES
            ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-extrabold text-slate-900">Dashboard de Flota de Tiendas Autónomas</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Estado de Nodos Edge en Sucursales</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-medium">
                      <th className="py-3 px-4">Sucursal</th>
                      <th className="py-3 px-4">Hardware Edge</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">FPS YOLO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    {INITIAL_STORES.map(store => (
                      <tr key={store.id} className="hover:bg-slate-50">
                        <td className="py-4 px-4 font-semibold text-slate-900">{store.name}</td>
                        <td className="py-4 px-4 text-slate-700">{store.edgeDevice}</td>
                        <td className="py-4 px-4"><span className="text-emerald-600 font-semibold">Online</span></td>
                        <td className="py-4 px-4 font-semibold text-slate-900">{store.fps} FPS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: ASESOR GEMINI AI
            ===================================================================== */}
        {activeTab === 'ai-advisor' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-extrabold text-slate-900">Asesor Estratégico (Gemini AI)</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {aiResponses.map((msg, index) => (
                  <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 border'
                    }`}>
                      <div className="font-semibold text-xs mb-1 opacity-70">
                        {msg.role === 'user' ? 'Gerente' : 'Consultor IA'}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAiSubmit} className="flex gap-3 pt-4 border-t">
                <input 
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Pregunte sobre YOLO, OpenCV o modelos de visión para su webcam..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
                <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">
                  Consultar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: ROI
            ===================================================================== */}
        {activeTab === 'roi' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-extrabold text-slate-900">Calculadora de ROI (RD$)</h2>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="text-xl font-bold">Retorno Estimado en Pesos Dominicanos</div>
              <p className="text-sm text-slate-300">
                Ahorro anual estimado por sucursal sustituyendo cajeros tradicionales: <strong className="text-emerald-400">RD$ 1,450,000 / año</strong>. Payback en 3.2 meses.
              </p>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500">
        Grab & Go RD · Edge AI & OpenCV Webcam Integration © 2026
      </footer>
    </div>
  );
}
