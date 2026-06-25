import React from 'react';
import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

interface NpcUpdateModalProps {
  npc: any;
  npcIndex: number;
  onClose: () => void;
  onApply: (updatedData: any) => void;
}

function AutoResizeTextarea({ value, onChange, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustHeight = React.useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  React.useEffect(() => {
    adjustHeight();
    const timer1 = setTimeout(adjustHeight, 50);
    const timer2 = setTimeout(adjustHeight, 300);
    const timer3 = setTimeout(adjustHeight, 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [value, adjustHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        adjustHeight();
        if (onChange) onChange(e);
      }}
      className={`${className || ''} overflow-hidden resize-none`}
      rows={1}
      {...props}
    />
  );
}

function ArrayEditor({ items, isDark, onChange, readonly = false }: { items: any[], isDark: boolean, onChange?: (val: any[]) => void, readonly?: boolean }) {
  const arr = Array.isArray(items) ? items : [];
  
  if (arr.length === 0) return <div className="italic opacity-50 text-sm">Không có dữ liệu</div>;

  return (
    <div className="flex flex-col gap-3">
      {arr.map((item, i) => (
        <div key={i} className={`p-3 rounded-lg border flex flex-col gap-2 ${isDark ? 'bg-black/20 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="flex gap-2 items-center">
            <span className={`text-xs font-bold w-12 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Tên</span>
            {readonly ? (
              <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.name || item.fullName || item.title || ''}</span>
            ) : (
              <input
                type="text"
                value={item.name || item.fullName || item.title || ''}
                onChange={(e) => {
                  if (onChange) {
                    const newArr = [...arr];
                    newArr[i] = { ...newArr[i], name: e.target.value };
                    onChange(newArr);
                  }
                }}
                className={`flex-1 px-2 py-1 text-sm rounded outline-none ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-green-500/50' : 'bg-slate-50 text-slate-800 border-slate-200 focus:border-green-500/50'} border`}
              />
            )}
          </div>
          
          {(item.description !== undefined || readonly) && (
            <div className="flex flex-col gap-1">
              <span className={`text-xs font-bold ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Mô tả</span>
              {readonly ? (
                <span className={`text-sm whitespace-pre-wrap ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{item.description || ''}</span>
              ) : (
                <AutoResizeTextarea
                  value={item.description || ''}
                  onChange={(e) => {
                    if (onChange) {
                      const newArr = [...arr];
                      newArr[i] = { ...newArr[i], description: e.target.value };
                      onChange(newArr);
                    }
                  }}
                  className={`w-full px-2 py-1 text-sm rounded outline-none min-h-[60px] ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-green-500/50' : 'bg-slate-50 text-slate-800 border-slate-200 focus:border-green-500/50'} border`}
                />
              )}
            </div>
          )}

          {(item.level !== undefined || item.type !== undefined) && (
            <div className="flex gap-4">
              {item.type !== undefined && (
                <div className="flex gap-2 items-center flex-1">
                  <span className={`text-xs font-bold ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Loại</span>
                  {readonly ? (
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{item.type || ''}</span>
                  ) : (
                    <input
                      type="text"
                      value={item.type || ''}
                      onChange={(e) => {
                        if (onChange) {
                          const newArr = [...arr];
                          newArr[i] = { ...newArr[i], type: e.target.value };
                          onChange(newArr);
                        }
                      }}
                      className={`flex-1 px-2 py-1 text-sm rounded outline-none ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-green-500/50' : 'bg-slate-50 text-slate-800 border-slate-200 focus:border-green-500/50'} border`}
                    />
                  )}
                </div>
              )}
              {item.level !== undefined && (
                <div className="flex gap-2 items-center flex-1">
                  <span className={`text-xs font-bold ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Cấp</span>
                  {readonly ? (
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{item.level || ''}</span>
                  ) : (
                    <input
                      type="text"
                      value={item.level || ''}
                      onChange={(e) => {
                        if (onChange) {
                          const newArr = [...arr];
                          newArr[i] = { ...newArr[i], level: e.target.value };
                          onChange(newArr);
                        }
                      }}
                      className={`flex-1 px-2 py-1 text-sm rounded outline-none ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-green-500/50' : 'bg-slate-50 text-slate-800 border-slate-200 focus:border-green-500/50'} border`}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ObjectEditor({ obj, isDark, onChange, readonly = false }: { obj: Record<string, any>, isDark: boolean, onChange?: (val: Record<string, any>) => void, readonly?: boolean }) {
  if (!obj || typeof obj !== 'object') return <div className="italic opacity-50 text-sm">Không có dữ liệu</div>;
  
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="flex flex-col gap-1">
          <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{k}</span>
          {readonly ? (
            <div className={`text-sm whitespace-pre-wrap p-2 rounded ${isDark ? 'bg-black/20 text-white/80 border border-white/5' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
              {typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v, null, 2)}
            </div>
          ) : (
            <AutoResizeTextarea
              value={typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v, null, 2)}
              onChange={(e) => {
                if (onChange) {
                  const newObj = { ...obj, [k]: e.target.value };
                  onChange(newObj);
                }
              }}
              className={`w-full px-2 py-1 text-sm rounded outline-none min-h-[40px] ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-green-500/50' : 'bg-slate-50 text-slate-800 border-slate-200 focus:border-green-500/50'} border`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function NpcUpdateModal({ npc, npcIndex, onClose, onApply }: NpcUpdateModalProps) {
  const theme = useStore(state => state.theme);
  const isDark = theme.group === 'Dark';

  const [pending, setPending] = React.useState<any>(npc.pendingUpdates || {});

  const handleChange = (key: string, val: any) => {
    setPending({ ...pending, [key]: val });
  };

  const handleRemoveField = (key: string) => {
    const updated = { ...pending };
    delete updated[key];
    setPending(updated);
  };

  const handleApply = () => {
    onApply(pending);
  };

  if (!npc) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md`} onClick={(e) => e.stopPropagation()}>
      <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-slate-900/40'}`} onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-screen h-screen flex flex-col overflow-hidden ${
          isDark 
            ? 'bg-[#0f172a]' 
            : 'bg-white text-slate-800'
        }`}
      >
        <div className={`p-4 border-b flex items-center shrink-0 gap-4 relative z-20 shadow-sm ${isDark ? 'border-white/10 bg-[#0f172a]' : 'border-slate-200 bg-white'}`}>
          <div className="flex-1 flex justify-center">
             <div className={`text-lg font-bold uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Nội Dung Gốc</div>
          </div>
          <div className="flex-1 flex justify-center items-center gap-2">
             <div className={`text-lg font-bold uppercase tracking-widest ${isDark ? 'text-green-400' : 'text-green-600'}`}>Cập Nhật: {npc.name || npc.fullName}</div>
          </div>
          <div className="flex items-center gap-2 absolute right-4">
            <button
              onClick={handleApply}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-green-600/20"
            >
              <Check size={18} /> Lưu
            </button>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200'}`}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col p-6 gap-8">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 pb-20">
            {Object.keys(pending).map((key) => {
              if (key === 'statusData') return null;
              
              const isArray = Array.isArray(npc[key]) || Array.isArray(pending[key]);
              const isObject = (typeof npc[key] === 'object' && npc[key] !== null) || (typeof pending[key] === 'object' && pending[key] !== null);
              
              return (
                <div key={key} className="flex flex-col md:flex-row gap-6">
                  {/* Cột Gốc */}
                  <div className={`flex-1 p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'} flex flex-col`}>
                    <span className={`block text-xs font-black uppercase tracking-widest mb-4 ${isDark ? 'text-blue-400/80' : 'text-blue-600/80'}`}>{key}</span>
                    <div className={`flex-1`}>
                      {isArray ? (
                        <ArrayEditor items={npc[key] || []} isDark={isDark} readonly />
                      ) : isObject ? (
                        <ObjectEditor obj={npc[key] || {}} isDark={isDark} readonly />
                      ) : (
                        <div className={`text-sm whitespace-pre-wrap leading-relaxed ${isDark ? 'text-white/90' : 'text-slate-700'}`}>
                          {npc[key] || <span className="italic opacity-50">Không có dữ liệu</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cột Cập Nhật */}
                  <div className={`flex-1 p-5 rounded-2xl border relative focus-within:ring-2 ring-green-500/50 shadow-sm ${isDark ? 'bg-green-900/10 border-green-500/30' : 'bg-green-50 border-green-200'} flex flex-col`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-green-400' : 'text-green-600'}`}>{key}</span>
                      <button onClick={() => handleRemoveField(key)} className="text-[10px] bg-red-500/10 text-red-500 font-bold px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors">XÓA/BỎ QUA</button>
                    </div>
                    <div className="flex-1">
                      {isArray ? (
                        <ArrayEditor items={pending[key] || []} isDark={isDark} onChange={(val) => handleChange(key, val)} />
                      ) : isObject ? (
                        <ObjectEditor obj={pending[key] || {}} isDark={isDark} onChange={(val) => handleChange(key, val)} />
                      ) : (
                        <AutoResizeTextarea 
                          value={pending[key] || ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className={`w-full min-h-[120px] text-sm outline-none bg-transparent whitespace-pre-wrap leading-relaxed ${isDark ? 'text-white' : 'text-slate-700 bg-white border border-green-200 p-3 rounded-lg shadow-inner'}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {pending.statusData && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className={`flex-1 p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'} flex flex-col`}>
                  <span className={`block text-xs font-black uppercase tracking-widest mb-4 ${isDark ? 'text-blue-400/80' : 'text-blue-600/80'}`}>statusData (Gốc)</span>
                  <div className={`flex-1`}>
                    <ObjectEditor obj={npc.statusData || {}} isDark={isDark} readonly />
                  </div>
                </div>
                
                <div className={`flex-1 p-5 rounded-2xl border relative focus-within:ring-2 ring-green-500/50 shadow-sm ${isDark ? 'bg-green-900/10 border-green-500/30' : 'bg-green-50 border-green-200'} flex flex-col`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-green-400' : 'text-green-600'}`}>statusData (Cập nhật)</span>
                    <button onClick={() => handleRemoveField('statusData')} className="text-[10px] bg-red-500/10 text-red-500 font-bold px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors">XÓA/BỎ QUA</button>
                  </div>
                  <div className="flex-1">
                    <ObjectEditor obj={pending.statusData || {}} isDark={isDark} onChange={(val) => handleChange('statusData', val)} />
                  </div>
                </div>
              </div>
            )}

            {Object.keys(pending).length === 0 && (
              <div className="text-center italic opacity-50 p-8 text-lg">Không còn trường nào để cập nhật.</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

