import { useState, useEffect } from "react";
import { evaluate } from "mathjs";

export function Calculator(){
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [useDegrees, setUseDegrees] = useState(true);

    // Carregar histórico do localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem("calculatorHistory");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Função para pré-processar a expressão antes de avaliar
    const preprocessExpression = (expr) => {
        // Substituir π por pi
        let processed = expr.replace(/π/g, "pi");
        
        // Se estiver usando graus, converter funções trigonométricas
        if (useDegrees) {
            // Substituir sen(angulo) por sin((pi/180)*angulo)
            processed = processed.replace(/sin\(([^)]+)\)/g, (match, angle) => {
                return `sin((pi/180)*(${angle}))`;
            });
            // Substituir cos(angulo) por cos((pi/180)*angulo)
            processed = processed.replace(/cos\(([^)]+)\)/g, (match, angle) => {
                return `cos((pi/180)*(${angle}))`;
            });
            // Substituir tan(angulo) por tan((pi/180)*angulo)
            processed = processed.replace(/tan\(([^)]+)\)/g, (match, angle) => {
                return `tan((pi/180)*(${angle}))`;
            });
        }
        
        return processed;
    };

    const handleClick = (value) => {
        setInput(input + value);
    };

    const handlePower = () => {
        setInput(input + "^");
    };

    const handleCalculate = () => {
        try {
            if (!input) return;
            
            // Pré-processar a expressão
            const expressionToEvaluate = preprocessExpression(input);
            const evalResult = evaluate(expressionToEvaluate);
            
            const calculation = {
                id: Date.now(),
                expression: input,
                result: evalResult.toString(),
                timestamp: new Date().toLocaleString()
            };
            
            // Salvar no histórico (manter últimos 20 cálculos)
            const newHistory = [calculation, ...history].slice(0, 20);
            setHistory(newHistory);
            localStorage.setItem("calculatorHistory", JSON.stringify(newHistory));
            
            setResult(evalResult.toString());
            setInput(evalResult.toString());
        } catch (error) {
            setResult("Error");
            console.error(error);
        }
    };
    
    const handleClear = () => {
        setInput("");
        setResult("");
    };

    const handleDelete = () => setInput((prev) => prev.slice(0, -1));

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("calculatorHistory");
    };
    
    const loadFromHistory = (expression) => {
        setInput(expression);
        setShowHistory(false);
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
            {/* Efeito de fundo futurista */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>
            
            <div className={`relative rounded-3xl shadow-2xl w-[420px] overflow-hidden backdrop-blur-sm transition-all duration-500 ${
                isDarkMode 
                    ? 'bg-gray-900/90 border border-purple-500/30 shadow-purple-500/20' 
                    : 'bg-white/90 border border-blue-300/30 shadow-blue-500/20'
            } ${isExpanded ? 'scale-100' : ''}`}>
                {/* Header futurista */}
                <div className={`p-4 flex justify-between items-center border-b ${
                    isDarkMode ? 'border-purple-500/30 bg-gray-800/50' : 'border-blue-300/30 bg-gray-100/50'
                }`}>
                    <div className="flex gap-3">
                        <button 
                            className={`text-sm px-3 py-1.5 rounded-xl hover:opacity-80 transition-all duration-300 font-bold backdrop-blur-sm ${
                                isDarkMode ? 'bg-purple-600/80 text-yellow-300 hover:bg-purple-700' : 'bg-blue-500/80 text-white hover:bg-blue-600'
                            }`}
                            onClick={toggleTheme}
                        >
                            {isDarkMode ? "☀️" : "🌙"}
                        </button>
                        <button 
                            className={`text-sm px-3 py-1.5 rounded-xl hover:opacity-80 transition-all duration-300 font-bold backdrop-blur-sm ${
                                isDarkMode ? 'bg-purple-600/80 text-white hover:bg-purple-700' : 'bg-blue-500/80 text-white hover:bg-blue-600'
                            }`}
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            📜
                        </button>
                        <button 
                            className={`text-sm px-3 py-1.5 rounded-xl hover:opacity-80 transition-all duration-300 font-bold backdrop-blur-sm ${
                                isDarkMode ? 'bg-purple-600/80 text-white hover:bg-purple-700' : 'bg-blue-500/80 text-white hover:bg-blue-600'
                            }`}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? "➖" : "➕"}
                        </button>
                        <button 
                            className={`text-xs px-2 py-1.5 rounded-xl transition-all duration-300 font-mono ${
                                isDarkMode 
                                    ? `bg-purple-600/80 ${useDegrees ? 'text-yellow-300' : 'text-white'} hover:bg-purple-700` 
                                    : `bg-blue-500/80 ${useDegrees ? 'text-yellow-200' : 'text-white'} hover:bg-blue-600`
                            }`}
                            onClick={() => setUseDegrees(!useDegrees)}
                        >
                            {useDegrees ? "DEG" : "RAD"}
                        </button>
                    </div>
                    <div className={`text-xs font-mono ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>
                        Futuristic v2.0
                    </div>
                </div>
                
                {/* Display futurista */}
                <div className={`p-6 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'}`}>
                    <div className={`mb-4 p-4 rounded-2xl text-right backdrop-blur-sm border ${
                        isDarkMode 
                            ? 'bg-gray-800/50 border-purple-500/30 shadow-inner shadow-purple-500/10' 
                            : 'bg-gray-50/50 border-blue-300/30 shadow-inner shadow-blue-500/10'
                    }`}>
                        <div className={`text-xs font-mono min-h-[20px] ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>
                            {input || "0"}
                        </div>
                        <div className={`text-5xl font-mono font-bold mt-2 truncate transition-all duration-300 ${
                            isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400' : 'text-gray-800'
                        }`}>
                            {result || "="}
                        </div>
                    </div>
                    
                    {/* Botões principais */}
                    <div className="grid grid-cols-4 gap-3">
                        {/* Linha 1 */}
                        <button className={`rounded-xl p-3 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                            isDarkMode 
                                ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                        }`}
                        onClick={handleClear}
                        >AC
                        </button>
                        <button className={`rounded-xl p-3 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                            isDarkMode 
                                ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                        }`}
                        onClick={handleClear}
                        >C
                        </button>
                        <button className={`rounded-xl p-3 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                            isDarkMode 
                                ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                        }`}
                        onClick={handleDelete}
                        >⌫
                        </button>
                        <button className={`rounded-xl p-3 text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30' 
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30'
                        }`}
                        onClick={() => handleClick("/")}
                        >÷
                        </button>

                        {/* Linha 2 */}
                        {["7","8","9","*"].map((btn) => (
                            <button key={btn} className={`rounded-xl p-3 text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 text-white border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                    : 'bg-gray-100/50 text-gray-800 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                            }`}
                            onClick={() => handleClick(btn === "*" ? "*" : btn)}
                            >{btn === "*" ? "×" : btn}
                            </button>
                        ))}

                        {/* Linha 3 */}
                        {["4","5","6","-"].map((btn) => (
                            <button key={btn} className={`rounded-xl p-3 text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 text-white border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                    : 'bg-gray-100/50 text-gray-800 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                            }`}
                            onClick={() => handleClick(btn)}
                            >{btn}
                            </button>
                        ))}

                        {/* Linha 4 */}
                        {["1","2","3","+"].map((btn) => (
                            <button key={btn} className={`rounded-xl p-3 text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 text-white border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                    : 'bg-gray-100/50 text-gray-800 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                            }`}
                            onClick={() => handleClick(btn)}
                            >{btn}
                            </button>
                        ))}

                        {/* Linha 5 */}
                        <button className={`rounded-xl p-3 text-xl font-bold col-span-2 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                            isDarkMode 
                                ? 'bg-gray-800/50 text-white border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                : 'bg-gray-100/50 text-gray-800 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                        }`}
                        onClick={() => handleClick("0")}
                        >0
                        </button>
                        <button className={`rounded-xl p-3 text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                            isDarkMode 
                                ? 'bg-gray-800/50 text-white border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50' 
                                : 'bg-gray-100/50 text-gray-800 border-blue-300/30 hover:bg-blue-500/30 hover:border-blue-400/50'
                        }`}
                        onClick={() => handleClick(".")}
                        >.
                        </button>
                        <button className={`rounded-xl p-3 text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30'
                        }`}
                        onClick={handleCalculate}
                        >=
                        </button>
                    </div>

                    {/* Botões expandidos */}
                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-purple-500/30 animate-fadeIn">
                            <div className="grid grid-cols-4 gap-3">
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("sqrt(")}
                                >
                                    √
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={handlePower}
                                >
                                    xʸ
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("%")}
                                >
                                    %
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("(")}
                                >
                                    (
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick(")")}
                                >
                                    )
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("sin(")}
                                >
                                    sen
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("cos(")}
                                >
                                    cos
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("tan(")}
                                >
                                    tg
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("log(")}
                                >
                                    log
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("ln(")}
                                >
                                    ln
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("abs(")}
                                >
                                    |x|
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("π")}
                                >
                                    π
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold col-span-2 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm border ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-purple-300 border-purple-500/30 hover:bg-purple-600/30' 
                                            : 'bg-gray-200/50 text-blue-700 border-blue-300/30 hover:bg-blue-500/30'
                                    }`}
                                    onClick={() => handleClick("e")}
                                >
                                    e
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                                    }`}
                                    onClick={() => handleClick("^2")}
                                >
                                    x²
                                </button>
                                <button 
                                    className={`rounded-xl p-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                                    }`}
                                    onClick={() => handleClick("^3")}
                                >
                                    x³
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Painel de História Futurista */}
            {showHistory && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/50 animate-fadeIn">
                    <div className={`rounded-3xl shadow-2xl w-[400px] max-h-[600px] overflow-hidden backdrop-blur-sm border ${
                        isDarkMode 
                            ? 'bg-gray-900/95 border-purple-500/30' 
                            : 'bg-white/95 border-blue-300/30'
                    }`}>
                        <div className={`p-4 flex justify-between items-center border-b ${
                            isDarkMode ? 'border-purple-500/30' : 'border-blue-300/30'
                        }`}>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>
                                📊 Histórico de Cálculos
                            </h3>
                            <div className="flex gap-2">
                                <button 
                                    className={`text-xs px-3 py-1 rounded-lg transition-all ${
                                        isDarkMode 
                                            ? 'bg-red-600/80 text-white hover:bg-red-700' 
                                            : 'bg-red-500/80 text-white hover:bg-red-600'
                                    }`}
                                    onClick={clearHistory}
                                >
                                    Limpar
                                </button>
                                <button 
                                    className={`text-xs px-3 py-1 rounded-lg transition-all ${
                                        isDarkMode 
                                            ? 'bg-gray-600/80 text-white hover:bg-gray-700' 
                                            : 'bg-gray-500/80 text-white hover:bg-gray-600'
                                    }`}
                                    onClick={() => setShowHistory(false)}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[500px] space-y-2">
                            {history.length === 0 ? (
                                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Nenhum cálculo salvo ainda
                                </div>
                            ) : (
                                history.map((calc) => (
                                    <div 
                                        key={calc.id}
                                        className={`p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-102 ${
                                            isDarkMode 
                                                ? 'bg-gray-800/50 hover:bg-purple-600/30 border border-purple-500/20' 
                                                : 'bg-gray-100/50 hover:bg-blue-500/30 border border-blue-300/20'
                                        }`}
                                        onClick={() => loadFromHistory(calc.expression)}
                                    >
                                        <div className={`text-sm font-mono ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>
                                            {calc.expression} = {calc.result}
                                        </div>
                                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {calc.timestamp}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}