/**
 * Energy Explorer Component - React component for visualizing LLM energy usage
 */

const { useEffect, useState, useRef } = React;

const LLMEnergyExplorer = () => {
  // State for the active stage in the pipeline
  const [activeStage, setActiveStage] = useState('intro');
  const [animationActive, setAnimationActive] = useState(false);
  const [energyInput, setEnergyInput] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [dataSize, setDataSize] = useState(45); // TB of training data
  const [modelSize, setModelSize] = useState(175); // Billions of parameters
  const [serverLocation, setServerLocation] = useState('mixed');
  const [queryCount, setQueryCount] = useState(0);
  const [globalQueries, setGlobalQueries] = useState(0);
  
  // Use refs for animation timers
  const animationTimerRef = useRef(null);
  const trainingTimerRef = useRef(null);
  
  // Effect to simulate global query count increasing
  useEffect(() => {
    if (activeStage === 'inference' && animationActive) {
      animationTimerRef.current = setInterval(() => {
        setGlobalQueries(prev => prev + Math.floor(Math.random() * 100000) + 10000);
      }, 1000);
    } else if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, [activeStage, animationActive]);
  
  // Effect for training animation
  useEffect(() => {
    if (activeStage === 'training' && animationActive && totalEnergy < calculateTrainingEnergy()) {
      trainingTimerRef.current = setInterval(() => {
        setTotalEnergy(prev => {
          const newValue = prev + parseFloat(calculateTrainingEnergy()) / 100;
          return newValue < parseFloat(calculateTrainingEnergy()) ? newValue : parseFloat(calculateTrainingEnergy());
        });
      }, 100);
    } else if (trainingTimerRef.current) {
      clearInterval(trainingTimerRef.current);
    }
    
    return () => {
      if (trainingTimerRef.current) {
        clearInterval(trainingTimerRef.current);
      }
    };
  }, [activeStage, animationActive, totalEnergy]);

  // Simulation functions
  const addEnergy = () => {
    if (energyInput < 100) {
      setEnergyInput(prev => prev + 5);
    }
  };
  
  const resetSimulation = () => {
    setActiveStage('intro');
    setAnimationActive(false);
    setEnergyInput(0);
    setTotalEnergy(0);
    setQueryCount(0);
    setGlobalQueries(0);
  };
  
  const startStopAnimation = () => {
    setAnimationActive(!animationActive);
  };

  const moveToTraining = () => {
    setActiveStage('training');
    setTotalEnergy(0);
  };

  const moveToInference = () => {
    setActiveStage('inference');
    setQueryCount(0);
    setGlobalQueries(0);
  };

  // Calculate CO2 emissions based on server location
  const calculateCO2 = (energy) => {
    const emissionFactors = {
      coal: 0.9, // kg CO2/kWh
      mixed: 0.5,
      renewable: 0.1
    };
    return (energy * emissionFactors[serverLocation]).toFixed(1);
  };

  // Calculate water usage for cooling
  const calculateWater = (energy) => {
    return (energy * 3.5).toFixed(1); // Gallons per kWh
  };

  // Add a query to the count
  const addQuery = () => {
    setQueryCount(prev => prev + 1);
    // Each query uses a small amount of energy compared to training
    const queryEnergy = 0.0002 * modelSize;
    setTotalEnergy(prev => prev + queryEnergy);
  };

  // Get environmental equivalents
  const getCarMiles = (co2) => {
    return (co2 * 2.32).toFixed(0); // Miles per kg CO2
  };

  const getHomeEnergy = (energy) => {
    return (energy / 10).toFixed(1); // US homes powered for a day
  };

  // Calculate total training energy based on data and model size
  const calculateTrainingEnergy = () => {
    return ((dataSize / 10) * (modelSize / 100) * 100).toFixed(0); // Simplified calculation
  };

  // Render different stages
  const renderIntro = () => (
    <div className="bg-gray-900 p-6 rounded-lg text-center text-white">
      <h2 className="text-3xl font-bold mb-6">Why do Large Language Models consume so much energy?</h2>
      <p className="mb-8 text-lg">Explore the environmental cost of creating and using AI models like ChatGPT</p>
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-md bg-gray-800 h-6 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500"
            style={{ width: `${energyInput}%` }}
          ></div>
        </div>
        <p className="text-sm">Energy Input: {energyInput}%</p>
        
        <button 
          onClick={addEnergy} 
          className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          <lucide.Zap size={16} /> Add Energy
        </button>
      </div>
      
      {energyInput >= 30 && (
        <button 
          onClick={moveToTraining} 
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Begin the LLM Journey
        </button>
      )}
    </div>
  );

  const renderTraining = () => (
    <div className="bg-gray-900 p-6 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Training Phase: Creating the Model</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl mb-3">Training Configuration</h3>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">Training Data Size (TB)</label>
            <input 
              type="range" 
              min="10" 
              max="100"
              value={dataSize}
              onChange={(e) => setDataSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs">
              <span>Small (10TB)</span>
              <span>GPT-3 (45TB)</span>
              <span>Massive (100TB)</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">Model Size (Billions of Parameters)</label>
            <input 
              type="range" 
              min="10" 
              max="500"
              value={modelSize}
              onChange={(e) => setModelSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs">
              <span>Small (10B)</span>
              <span>GPT-3 (175B)</span>
              <span>Massive (500B)</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">Training Location</label>
            <select 
              value={serverLocation}
              onChange={(e) => setServerLocation(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2"
            >
              <option value="coal">Coal-powered Region</option>
              <option value="mixed">Mixed Energy Sources</option>
              <option value="renewable">Renewable Energy</option>
            </select>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl mb-3">Environmental Impact</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Energy Required:</p>
              <p className="text-xl font-bold">{calculateTrainingEnergy()} MWh</p>
              <p className="text-xs text-gray-500">≈ Powers {getHomeEnergy(calculateTrainingEnergy())} US homes for a year</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">CO₂ Emissions:</p>
              <p className="text-xl font-bold">{calculateCO2(calculateTrainingEnergy())} tons</p>
              <p className="text-xs text-gray-500">≈ {getCarMiles(calculateCO2(calculateTrainingEnergy()) * 1000)} miles driven in a car</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Water Usage for Cooling:</p>
              <p className="text-xl font-bold">{calculateWater(calculateTrainingEnergy())} thousand gallons</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mt-4">
        <button 
          onClick={startStopAnimation} 
          className={`flex items-center gap-2 ${animationActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} px-4 py-2 rounded-lg`}
        >
          {animationActive ? <><lucide.Pause size={16} /> Pause</> : <><lucide.Play size={16} /> Start Training</>}
        </button>
        
        {totalEnergy >= parseFloat(calculateTrainingEnergy()) * 0.8 && (
          <button 
            onClick={moveToInference} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <lucide.Server size={16} /> Deploy Model
          </button>
        )}
      </div>
      
      {animationActive && (
        <div className="mt-6">
          <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-red-500 h-full transition-all duration-1000"
              style={{ width: `${(totalEnergy / calculateTrainingEnergy()) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-center">Training Progress: {((totalEnergy / calculateTrainingEnergy()) * 100).toFixed(0)}%</p>
        </div>
      )}
    </div>
  );

  const renderInference = () => (
    <div className="bg-gray-900 p-6 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Inference Phase: Using the Model</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl mb-3">Your LLM Usage</h3>
          
          <div className="flex flex-col items-center mb-6">
            <button 
              onClick={addQuery} 
              className="mb-4 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full text-lg font-semibold"
            >
              Send a Query
            </button>
            
            <div className="text-center">
              <p className="text-4xl font-bold">{queryCount}</p>
              <p className="text-sm text-gray-400">Your Queries</p>
            </div>
            
            <div className="mt-4 w-full">
              <p className="text-sm text-gray-400">Energy Used:</p>
              <p className="text-xl font-bold">{(totalEnergy).toFixed(2)} kWh</p>
              <p className="text-xs text-gray-500">≈ {(totalEnergy * 0.5).toFixed(2)} kg CO₂</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl mb-3">Global LLM Usage</h3>
          
          <div className="flex justify-center mb-4">
            <button 
              onClick={startStopAnimation} 
              className={`flex items-center gap-2 ${animationActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} px-4 py-2 rounded-lg`}
            >
              {animationActive ? <><lucide.Pause size={16} /> Pause</> : <><lucide.Play size={16} /> Simulate Global Usage</>}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-4xl font-bold">{globalQueries.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Global Queries</p>
            
            <div className="mt-4">
              <p className="text-sm text-gray-400">Estimated Global Energy:</p>
              <p className="text-xl font-bold">{(globalQueries * 0.0002 * modelSize / 1000).toFixed(2)} MWh</p>
              <p className="text-xs text-gray-500">≈ {((globalQueries * 0.0002 * modelSize / 1000) * 0.5).toFixed(2)} tons CO₂</p>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-400 text-center">
            <p>ChatGPT sees ~1.7 billion visits per month</p>
            <p>Global inference can eventually exceed training energy costs</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h3 className="text-xl mb-3">Energy Comparison: Training vs. Inference</h3>
        
        <div className="flex items-center mb-4">
          <div className="w-1/2 pr-2">
            <p className="text-sm text-gray-400 mb-1">One-time Training Cost</p>
            <div className="h-8 bg-red-900 rounded-lg overflow-hidden">
              <div 
                className="bg-red-500 h-full"
                style={{ width: '100%' }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1">{calculateTrainingEnergy()} MWh</p>
          </div>
          
          <div className="w-1/2 pl-2">
            <p className="text-sm text-gray-400 mb-1">Cumulative Inference Cost</p>
            <div className="h-8 bg-blue-900 rounded-lg overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(((globalQueries * 0.0002 * modelSize / 1000) / calculateTrainingEnergy()) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1">{(globalQueries * 0.0002 * modelSize / 1000).toFixed(2)} MWh</p>
          </div>
        </div>
        
        <p className="text-sm text-center">
          {((globalQueries * 0.0002 * modelSize / 1000) / calculateTrainingEnergy() * 100).toFixed(2)}% of training energy has been used in inference so far
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <div className="bg-gray-800 p-4 rounded-lg inline-block">
          <h3 className="text-xl mb-3">Key Insight</h3>
          <p>AI's energy cost doesn't end with training—daily usage compounds into an ongoing environmental burden.</p>
        </div>
      </div>
    </div>
  );

  // Main render logic
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">The Environmental Cost of Large Language Models</h1>
          <p className="text-gray-400">An explorable explanation of the energy footprint behind AI</p>
        </header>
        
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <button 
              onClick={resetSimulation} 
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-sm"
            >
              <lucide.RefreshCw size={14} /> Reset
            </button>
            
            <div className="flex">
              <button 
                onClick={() => setActiveStage('intro')} 
                className={`px-3 py-1 rounded-l-lg text-sm ${activeStage === 'intro' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <lucide.Home size={14} />
              </button>
              <button 
                onClick={() => setActiveStage('training')} 
                className={`px-3 py-1 text-sm ${activeStage === 'training' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                disabled={totalEnergy === 0}
              >
                <lucide.Database size={14} />
              </button>
              <button 
                onClick={() => setActiveStage('inference')} 
                className={`px-3 py-1 rounded-r-lg text-sm ${activeStage === 'inference' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                disabled={totalEnergy < parseFloat(calculateTrainingEnergy()) * 0.8}
              >
                <lucide.Globe size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          {activeStage === 'intro' && renderIntro()}
          {activeStage === 'training' && renderTraining()}
          {activeStage === 'inference' && renderInference()}
        </div>
      </div>
    </div>
  );
};

// Initialize the Energy Explorer component
const EnergyExplorerComponent = {
  init: function() {
    const reactRoot = document.getElementById('react-root');
    if (reactRoot) {
      ReactDOM.render(<LLMEnergyExplorer />, reactRoot);
    }
  }
};

// Make the component available globally
window.EnergyExplorerComponent = EnergyExplorerComponent;
