/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRightLeft, 
  Search, 
  Layers, 
  Zap, 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Info
} from 'lucide-react';

// --- Types ---
type AlgorithmType = 'bubble' | 'selection' | 'quick' | 'sequential' | 'binary';

interface DataItem {
  id: string;
  value: number;
}

// --- Components ---

const AlgorithmCard = ({ title, description, icon: Icon, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 border-2 ${
      active 
        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-gray-50'
    }`}
  >
    <div className={`p-3 rounded-full mb-2 ${active ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <Icon size={24} />
    </div>
    <span className="text-sm font-bold">{title}</span>
  </button>
);

interface CircleProps {
  value: number;
  status?: 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'target' | 'found' | 'inactive';
  index: number;
}

const Circle: React.FC<CircleProps> = ({ value, status, index }) => {
  const getColors = () => {
    switch (status) {
      case 'comparing': return 'bg-yellow-400 border-yellow-600 text-white scale-110 z-10';
      case 'swapping': return 'bg-red-500 border-red-700 text-white scale-110 z-20';
      case 'sorted': return 'bg-green-500 border-green-700 text-white';
      case 'pivot': return 'bg-purple-600 border-purple-800 text-white ring-4 ring-purple-200';
      case 'target': return 'bg-blue-600 border-blue-800 text-white ring-4 ring-blue-200';
      case 'found': return 'bg-pink-500 border-pink-700 text-white scale-125 z-30';
      case 'inactive': return 'bg-gray-200 border-gray-300 text-gray-400 opacity-50';
      default: return 'bg-white border-blue-500 text-blue-700';
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl md:text-2xl shadow-sm ${getColors()}`}
    >
      {value}
    </motion.div>
  );
};

// --- Algorithm Logic Hooks & Components ---

const BubbleSort = () => {
  const [data, setData] = useState<DataItem[]>([
    { id: '1', value: 4 },
    { id: '2', value: 2 },
    { id: '3', value: 5 },
    { id: '4', value: 1 },
    { id: '5', value: 3 },
  ]);
  const [step, setStep] = useState(0);
  const [comparing, setComparing] = useState<string[]>([]);
  const [swapping, setSwapping] = useState<string[]>([]);
  const [sortedIds, setSortedIds] = useState<string[]>([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [inputVal, setInputVal] = useState('');

  const reset = (nums?: number[]) => {
    const d = nums ? nums.map((v, i) => ({ id: `input-${i}-${v}`, value: v })) : [
      { id: '1', value: 4 },
      { id: '2', value: 2 },
      { id: '3', value: 5 },
      { id: '4', value: 1 },
      { id: '5', value: 3 },
    ];
    setData(d);
    setStep(0);
    setComparing([]);
    setSwapping([]);
    setSortedIds([]);
    setStats({ comparisons: 0, swaps: 0 });
  };

  const handleCustomInput = () => {
    const nums = inputVal.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) {
      reset(nums.slice(0, 8));
      setInputVal('');
    }
  };

  const nextStep = () => {
    let currentData = [...data];
    let n = currentData.length;
    let totalSteps = 0;
    let found = false;

    for (let pass = 0; pass < n - 1; pass++) {
      for (let idx = 0; idx < n - 1 - pass; idx++) {
        if (totalSteps === step) {
          const id1 = currentData[idx].id;
          const id2 = currentData[idx + 1].id;
          setComparing([id1, id2]);
          setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
          
          if (currentData[idx].value > currentData[idx + 1].value) {
            setTimeout(() => {
              setSwapping([id1, id2]);
              const temp = currentData[idx];
              currentData[idx] = currentData[idx + 1];
              currentData[idx + 1] = temp;
              setData(currentData);
              setStats(s => ({ ...s, swaps: s.swaps + 1 }));
            }, 500);
          }
          found = true;
          break;
        }
        totalSteps++;
      }
      if (found) break;
    }

    if (!found) {
      setSortedIds(currentData.map(d => d.id));
      setComparing([]);
      setSwapping([]);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Layers className="text-blue-500" /> 버블 정렬 (Bubble Sort)
        </h3>
        <p className="text-gray-600 mb-6">인접한 두 원소를 비교하여 큰 값을 뒤로 보냅니다. (PDF 93p)</p>
        
        <div className="flex justify-center gap-4 mb-10 h-24 items-center">
          {data.map((item, idx) => (
            <Circle 
              key={item.id} 
              value={item.value} 
              index={idx}
              status={
                swapping.includes(item.id) ? 'swapping' :
                comparing.includes(item.id) ? 'comparing' :
                sortedIds.includes(item.id) ? 'sorted' : undefined
              }
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
            <span className="block text-sm text-yellow-600 font-medium">비교 횟수</span>
            <span className="text-2xl font-bold text-yellow-700">{stats.comparisons}</span>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
            <span className="block text-sm text-red-600 font-medium">교환 횟수</span>
            <span className="text-2xl font-bold text-red-700">{stats.swaps}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            <Play size={18} /> 다음 단계
          </button>
          <button onClick={() => reset()} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            <RotateCcw size={18} /> 초기화
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h4 className="font-bold mb-3">직접 입력해보기</h4>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="예: 5, 1, 8, 3, 2"
            className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleCustomInput} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">적용</button>
        </div>
        <p className="text-xs text-blue-400 mt-2">* 쉼표로 구분하여 숫자를 입력하세요 (최대 8개)</p>
      </div>
    </div>
  );
};

const SelectionSort = () => {
  const [data, setData] = useState<DataItem[]>([
    { id: 's1', value: 4 },
    { id: 's2', value: 2 },
    { id: 's3', value: 5 },
    { id: 's4', value: 1 },
    { id: 's5', value: 3 },
  ]);
  const [step, setStep] = useState(0);
  const [comparing, setComparing] = useState<string[]>([]);
  const [swapping, setSwapping] = useState<string[]>([]);
  const [sortedIds, setSortedIds] = useState<string[]>([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [inputVal, setInputVal] = useState('');

  const reset = (nums?: number[]) => {
    const d = nums ? nums.map((v, i) => ({ id: `sel-${i}-${v}`, value: v })) : [
      { id: 's1', value: 4 },
      { id: 's2', value: 2 },
      { id: 's3', value: 5 },
      { id: 's4', value: 1 },
      { id: 's5', value: 3 },
    ];
    setData(d);
    setStep(0);
    setComparing([]);
    setSwapping([]);
    setSortedIds([]);
    setStats({ comparisons: 0, swaps: 0 });
  };

  const nextStep = () => {
    let currentData = [...data];
    let n = currentData.length;
    
    if (step >= n - 1) {
      setSortedIds(currentData.map(d => d.id));
      setComparing([]);
      return;
    }

    let min = step;
    for (let j = step + 1; j < n; j++) {
      if (currentData[j].value < currentData[min].value) {
        min = j;
      }
    }

    const id1 = currentData[step].id;
    const id2 = currentData[min].id;
    setComparing([id1, id2]);
    setStats(s => ({ ...s, comparisons: s.comparisons + (n - 1 - step) }));
    
    if (min !== step) {
      setTimeout(() => {
        setSwapping([id1, id2]);
        const temp = currentData[step];
        currentData[step] = currentData[min];
        currentData[min] = temp;
        setData(currentData);
        setStats(s => ({ ...s, swaps: s.swaps + 1 }));
        setSortedIds(prev => [...prev, id2]);
        setStep(step + 1);
      }, 500);
    } else {
      setSortedIds(prev => [...prev, id1]);
      setStep(step + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="text-orange-500" /> 선택 정렬 (Selection Sort)
        </h3>
        <p className="text-gray-600 mb-6">가장 작은 값을 찾아 맨 앞의 값과 교환합니다. (PDF 94p)</p>
        
        <div className="flex justify-center gap-4 mb-10 h-24 items-center">
          {data.map((item, idx) => (
            <Circle 
              key={item.id} 
              value={item.value} 
              index={idx}
              status={
                swapping.includes(item.id) ? 'swapping' :
                comparing.includes(item.id) ? 'comparing' :
                sortedIds.includes(item.id) ? 'sorted' : undefined
              }
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
            <span className="block text-sm text-yellow-600 font-medium">비교 횟수</span>
            <span className="text-2xl font-bold text-yellow-700">{stats.comparisons}</span>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
            <span className="block text-sm text-red-600 font-medium">교환 횟수</span>
            <span className="text-2xl font-bold text-red-700">{stats.swaps}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            <Play size={18} /> 다음 단계
          </button>
          <button onClick={() => reset()} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            <RotateCcw size={18} /> 초기화
          </button>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <h4 className="font-bold mb-3">직접 입력해보기</h4>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="예: 5, 1, 8, 3, 2"
            className="flex-1 px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button onClick={() => {
            const nums = inputVal.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            if (nums.length > 0) {
              reset(nums.slice(0, 8));
              setInputVal('');
            }
          }} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold">적용</button>
        </div>
        <p className="text-xs text-orange-400 mt-2">* 쉼표로 구분하여 숫자를 입력하세요 (최대 8개)</p>
      </div>
    </div>
  );
};

const QuickSort = () => {
  const [data, setData] = useState<DataItem[]>([
    { id: 'q1', value: 4 },
    { id: 'q2', value: 2 },
    { id: 'q3', value: 5 },
    { id: 'q4', value: 1 },
    { id: 'q5', value: 3 },
  ]);
  const [pivotId, setPivotId] = useState<string | null>(null);
  const [leftIds, setLeftIds] = useState<string[]>([]);
  const [rightIds, setRightIds] = useState<string[]>([]);
  const [sortedIds, setSortedIds] = useState<string[]>([]);
  const [stack, setStack] = useState<{ start: number; end: number }[]>([{ start: 0, end: 4 }]);
  const [currentRange, setCurrentRange] = useState<{ start: number; end: number } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('정렬을 시작하려면 다음 단계를 누르세요.');
  const [inputVal, setInputVal] = useState('');
  const [isDone, setIsDone] = useState(false);

  const reset = (nums?: number[]) => {
    const d = nums ? nums.map((v, i) => ({ id: `q-${i}-${v}`, value: v })) : [
      { id: 'q1', value: 4 },
      { id: 'q2', value: 2 },
      { id: 'q3', value: 5 },
      { id: 'q4', value: 1 },
      { id: 'q5', value: 3 },
    ];
    setData(d);
    setPivotId(null);
    setLeftIds([]);
    setRightIds([]);
    setSortedIds([]);
    setStack([{ start: 0, end: d.length - 1 }]);
    setCurrentRange(null);
    setCurrentIndex(0);
    setIsDone(false);
    setMessage('정렬을 시작하려면 다음 단계를 누르세요.');
  };

  const nextStep = () => {
    if (isDone) return;

    // 1. Pick a new range if not currently partitioning
    if (!currentRange) {
      if (stack.length === 0) {
        setIsDone(true);
        setMessage('모든 정렬이 완료되었습니다!');
        return;
      }

      const nextRange = stack[stack.length - 1];
      const newStack = stack.slice(0, -1);
      
      if (nextRange.start >= nextRange.end) {
        if (nextRange.start === nextRange.end) {
          setSortedIds(prev => [...prev, data[nextRange.start].id]);
        }
        setStack(newStack);
        // We don't return here, we want to pick the next range in the same step or show a message
        setMessage(`${nextRange.start}번 위치는 이미 정렬되었습니다.`);
        return;
      }

      setCurrentRange(nextRange);
      setStack(newStack);
      setPivotId(data[nextRange.start].id);
      setCurrentIndex(nextRange.start + 1);
      setMessage(`${nextRange.start + 1}번부터 ${nextRange.end + 1}번까지 분할을 시작합니다. 피봇: ${data[nextRange.start].value}`);
      return;
    }

    // 2. Partitioning step
    if (currentIndex <= currentRange.end) {
      const item = data[currentIndex];
      const pivot = data.find(d => d.id === pivotId);
      if (pivot) {
        if (item.value < pivot.value) {
          setLeftIds(prev => [...prev, item.id]);
          setMessage(`${item.value}는 ${pivot.value}보다 작으므로 왼쪽으로 분류합니다.`);
        } else {
          setRightIds(prev => [...prev, item.id]);
          setMessage(`${item.value}는 ${pivot.value}보다 크거나 같으므로 오른쪽으로 분류합니다.`);
        }
      }
      setCurrentIndex(currentIndex + 1);
    } else {
      // 3. Finish partitioning this range
      const left = data.slice(currentRange.start, currentRange.end + 1).filter(d => leftIds.includes(d.id));
      const right = data.slice(currentRange.start, currentRange.end + 1).filter(d => rightIds.includes(d.id));
      const pivot = data.find(d => d.id === pivotId)!;
      
      const newData = [...data];
      const partitioned = [...left, pivot, ...right];
      newData.splice(currentRange.start, partitioned.length, ...partitioned);
      
      setData(newData);
      setSortedIds(prev => [...prev, pivot.id]);
      
      const pivotFinalIdx = currentRange.start + left.length;
      const nextStack = [...stack];
      
      // Push ranges to stack (right then left so left is processed first)
      if (pivotFinalIdx + 1 < currentRange.end) {
        nextStack.push({ start: pivotFinalIdx + 1, end: currentRange.end });
      } else if (pivotFinalIdx + 1 === currentRange.end) {
        // Single element range
        setSortedIds(prev => [...prev, newData[currentRange.end].id]);
      }
      
      if (currentRange.start < pivotFinalIdx - 1) {
        nextStack.push({ start: currentRange.start, end: pivotFinalIdx - 1 });
      } else if (currentRange.start === pivotFinalIdx - 1) {
        // Single element range
        setSortedIds(prev => [...prev, newData[currentRange.start].id]);
      }

      setStack(nextStack);
      setCurrentRange(null);
      setPivotId(null);
      setLeftIds([]);
      setRightIds([]);
      setMessage(`분할 완료! 피봇 ${pivot.value}가 제 자리를 찾았습니다.`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="text-purple-500" /> 퀵 정렬 (Quick Sort)
        </h3>
        <p className="text-gray-600 mb-6">피봇을 기준으로 작은 값은 왼쪽, 큰 값은 오른쪽으로 분할하며 재귀적으로 정렬합니다.</p>
        
        {/* Full Data Preview at the top */}
        <div className="flex justify-center gap-2 mb-8 opacity-60 scale-75">
          {data.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                sortedIds.includes(item.id) 
                  ? 'border-green-500 bg-green-50 text-green-600' 
                  : 'border-slate-300 bg-white text-slate-500'
              }`}
            >
              {item.value}
            </motion.div>
          ))}
        </div>

        <div className="min-h-[250px] flex flex-col items-center justify-center gap-8">
          <div className="flex gap-4 items-center flex-wrap justify-center">
            {!currentRange && !isDone && data.map((item, idx) => (
              <Circle 
                key={item.id} 
                value={item.value} 
                index={idx} 
                status={sortedIds.includes(item.id) ? 'sorted' : undefined} 
              />
            ))}
            
            {currentRange && (
              <div className="flex flex-col items-center gap-8 w-full">
                <div className="flex flex-wrap justify-center gap-10">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Left (Small)</span>
                    <div className="flex gap-2 min-w-[100px] min-h-[64px] border-2 border-dashed border-gray-200 rounded-xl p-2 items-center justify-center">
                      {data.filter(d => leftIds.includes(d.id)).map((item, idx) => (
                        <Circle key={item.id} value={item.value} index={idx} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">Pivot</span>
                    {pivotId && <Circle value={data.find(d => d.id === pivotId)?.value || 0} index={0} status="pivot" />}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Right (Large)</span>
                    <div className="flex gap-2 min-w-[100px] min-h-[64px] border-2 border-dashed border-gray-200 rounded-xl p-2 items-center justify-center">
                      {data.filter(d => rightIds.includes(d.id)).map((item, idx) => (
                        <Circle key={item.id} value={item.value} index={idx} />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Show remaining elements in current range not yet partitioned */}
                <div className="flex gap-2 mt-4">
                  {data.slice(currentIndex, currentRange.end + 1).map((item, idx) => (
                    <Circle key={item.id} value={item.value} index={idx} status="inactive" />
                  ))}
                </div>
              </div>
            )}

            {isDone && data.map((item, idx) => (
              <Circle key={item.id} value={item.value} index={idx} status="sorted" />
            ))}
          </div>
          
          <div className="bg-blue-50 px-6 py-3 rounded-full text-blue-700 font-medium border border-blue-100 text-center max-w-lg">
            {message}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            <Play size={18} /> 다음 단계
          </button>
          <button onClick={() => reset()} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            <RotateCcw size={18} /> 초기화
          </button>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
        <h4 className="font-bold mb-3">직접 입력해보기</h4>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="예: 5, 1, 8, 3, 2"
            className="flex-1 px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button onClick={() => {
            const nums = inputVal.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            if (nums.length > 0) {
              reset(nums.slice(0, 8));
              setInputVal('');
            }
          }} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">적용</button>
        </div>
        <p className="text-xs text-purple-400 mt-2">* 쉼표로 구분하여 숫자를 입력하세요 (최대 8개)</p>
      </div>
    </div>
  );
};

const SequentialSearch = () => {
  const data: DataItem[] = [
    { id: 'seq1', value: 2 },
    { id: 'seq2', value: 5 },
    { id: 'seq3', value: 1 },
    { id: 'seq4', value: 6 },
    { id: 'seq5', value: 4 },
    { id: 'seq6', value: 5 },
  ];
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const target = 1;

  const nextStep = () => {
    if (foundIndex !== -1) return;
    const nextIdx = currentIndex + 1;
    if (nextIdx < data.length) {
      setCurrentIndex(nextIdx);
      if (data[nextIdx].value === target) {
        setFoundIndex(nextIdx);
      }
    }
  };

  const reset = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Search className="text-blue-500" /> 순차 탐색 (Sequential Search)
        </h3>
        <p className="text-gray-600 mb-6">처음부터 하나씩 비교하며 원하는 값을 찾습니다. (PDF 101p)</p>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-bold text-gray-500 mr-2">찾는 값:</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{target}</div>
          </div>

          <div className="flex justify-center gap-4 mb-10 h-24 items-center">
            {data.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center gap-2">
                <Circle 
                  value={item.value} 
                  index={idx}
                  status={
                    foundIndex === idx ? 'found' :
                    currentIndex === idx ? 'comparing' : undefined
                  }
                />
                <span className="text-xs font-bold text-gray-400">위치 {idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              <Play size={18} /> 다음 단계
            </button>
            <button onClick={reset} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
              <RotateCcw size={18} /> 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BinarySearch = () => {
  const data: DataItem[] = [
    { id: 'b1', value: 1 },
    { id: 'b2', value: 4 },
    { id: 'b3', value: 6 },
    { id: 'b4', value: 9 },
    { id: 'b5', value: 10 },
    { id: 'b6', value: 24 },
    { id: 'b7', value: 31 },
    { id: 'b8', value: 42 },
    { id: 'b9', value: 50 },
    { id: 'b10', value: 52 },
  ];
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(data.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState(false);
  const [target, setTarget] = useState(52);
  const [inputVal, setInputVal] = useState('');
  const [message, setMessage] = useState('탐색 범위를 정하고 시작하세요.');

  const reset = (newTarget?: number) => {
    setLeft(0);
    setRight(data.length - 1);
    setMid(null);
    setFound(false);
    if (newTarget !== undefined) setTarget(newTarget);
    setMessage('탐색 범위를 정하고 시작하세요.');
  };

  const nextStep = () => {
    if (found || left > right) return;

    const currentMid = Math.floor((left + right) / 2);
    setMid(currentMid);
    
    if (data[currentMid].value === target) {
      setFound(true);
      setMessage(`찾았습니다! 위치 ${currentMid + 1}의 값이 ${target}입니다.`);
    } else if (data[currentMid].value < target) {
      setLeft(currentMid + 1);
      setMessage(`${data[currentMid].value}보다 ${target}이 크므로 오른쪽 범위를 탐색합니다.`);
    } else {
      setRight(currentMid - 1);
      setMessage(`${data[currentMid].value}보다 ${target}이 작으므로 왼쪽 범위를 탐색합니다.`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Search className="text-green-500" /> 이진 탐색 (Binary Search)
        </h3>
        <p className="text-gray-600 mb-6">정렬된 데이터에서 범위를 반으로 줄여가며 찾습니다. (PDF 102p)</p>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="font-bold text-gray-500 mr-2">찾는 값:</span>
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">{target}</div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 items-center">
            {data.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center gap-2">
                <Circle 
                  value={item.value} 
                  index={idx}
                  status={
                    found && mid === idx ? 'found' :
                    mid === idx ? 'comparing' :
                    (idx < left || idx > right) ? 'inactive' : undefined
                  }
                />
                <span className="text-[10px] font-bold text-gray-400">{idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="bg-green-50 px-6 py-3 rounded-full text-green-700 font-medium border border-green-100">
            {message}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              <Play size={18} /> 다음 단계
            </button>
            <button onClick={() => reset()} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
              <RotateCcw size={18} /> 초기화
            </button>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
        <h4 className="font-bold mb-3">찾을 숫자 입력</h4>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="예: 31"
            className="flex-1 px-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button onClick={() => {
            const val = parseInt(inputVal);
            if (!isNaN(val)) {
              reset(val);
              setInputVal('');
            }
          }} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">적용</button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<AlgorithmType>('bubble');

  const renderContent = () => {
    switch (activeTab) {
      case 'bubble': return <BubbleSort />;
      case 'selection': return <SelectionSort />;
      case 'quick': return <QuickSort />;
      case 'sequential': return <SequentialSearch />;
      case 'binary': return <BinarySearch />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          >
            Algorithm Interactive Lab
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-800">
            알고리즘 <span className="text-blue-600">인터랙티브</span> 학습실
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            정렬과 탐색 알고리즘의 원리를 애니메이션과 함께 단계별로 학습해보세요. 
            교과서의 내용을 바탕으로 직접 데이터를 입력하고 결과를 확인할 수 있습니다.
          </p>
        </header>

        <nav className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          <AlgorithmCard 
            title="버블 정렬" 
            icon={ArrowRightLeft} 
            active={activeTab === 'bubble'} 
            onClick={() => setActiveTab('bubble')} 
          />
          <AlgorithmCard 
            title="선택 정렬" 
            icon={Layers} 
            active={activeTab === 'selection'} 
            onClick={() => setActiveTab('selection')} 
          />
          <AlgorithmCard 
            title="퀵 정렬" 
            icon={Zap} 
            active={activeTab === 'quick'} 
            onClick={() => setActiveTab('quick')} 
          />
          <AlgorithmCard 
            title="순차 탐색" 
            icon={Search} 
            active={activeTab === 'sequential'} 
            onClick={() => setActiveTab('sequential')} 
          />
          <AlgorithmCard 
            title="이진 탐색" 
            icon={Search} 
            active={activeTab === 'binary'} 
            onClick={() => setActiveTab('binary')} 
          />
        </nav>

        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Info size={16} />
            <span>본 자료는 교과서 3단원 정렬 및 탐색 알고리즘 학습을 위해 제작되었습니다.</span>
          </div>
          <p>© 2026 Interactive Algorithm Lab. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
