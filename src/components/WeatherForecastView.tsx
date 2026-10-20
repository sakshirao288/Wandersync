import React, { useState } from 'react';
import { WeatherDay, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { MOCK_WEATHER_FORECAST } from '../data/mockTravelData';
import { 
  Sun, 
  CloudRain, 
  CloudSun, 
  Cloud, 
  Wind, 
  Droplets, 
  Sparkles, 
  Calendar, 
  Clock, 
  ArrowRight,
  Shirt,
  Umbrella
} from 'lucide-react';

interface WeatherForecastViewProps {
  onGoToPacking?: () => void;
  lang: Language;
}

export const WeatherForecastView: React.FC<WeatherForecastViewProps> = ({
  onGoToPacking,
  lang,
}) => {
  const t = translations[lang];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const selectedDay = MOCK_WEATHER_FORECAST[selectedDayIndex] || MOCK_WEATHER_FORECAST[0];

  const formatTemp = (celsius: number) => {
    if (unit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const getWeatherIcon = (condition: WeatherDay['condition'], className = "w-6 h-6") => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${className} text-amber-500`} />;
      case 'rain':
        return <CloudRain className={`${className} text-sky-600`} />;
      case 'partly_cloudy':
        return <CloudSun className={`${className} text-amber-500`} />;
      case 'cloudy':
      default:
        return <Cloud className={`${className} text-slate-400`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Temperature Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span>{t.weather.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.weather.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold shrink-0">
            <button
              onClick={() => setUnit('C')}
              className={`px-3 py-1 rounded transition-colors ${
                unit === 'C' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Celsius (°C)
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-3 py-1 rounded transition-colors ${
                unit === 'F' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* 5-Day Strip Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
          {MOCK_WEATHER_FORECAST.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <div
                key={day.date}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-between shadow-xs ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-[11px] font-bold text-slate-700 block truncate max-w-full">
                  {day.dayName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 block mb-2 font-mono">
                  {day.date.slice(5)}
                </span>

                <div className="my-1">
                  {getWeatherIcon(day.condition, "w-8 h-8 mx-auto")}
                </div>

                <div className="mt-2 text-xs font-mono tabular-nums">
                  <span className="font-bold text-slate-900">
                    {formatTemp(day.tempHigh)}
                  </span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-slate-500">
                    {formatTemp(day.tempLow)}
                  </span>
                </div>

                {day.rainProbability > 0 && (
                  <span className="text-[10px] font-mono text-sky-600 mt-1 flex items-center gap-0.5">
                    <CloudRain className="w-3 h-3" /> {day.rainProbability}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Day Details & Hourly Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Detailed Expedition Forecast
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5 font-display">
                {selectedDay.dayName} · {selectedDay.date}
              </h3>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-bold text-slate-900">
                {formatTemp(selectedDay.tempHigh)}
              </span>
              <span className="text-xs text-slate-500 block">
                Low: {formatTemp(selectedDay.tempLow)}
              </span>
            </div>
          </div>

          {/* 4 Micro Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                {t.weather.rainProb}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                {selectedDay.rainProbability}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                {t.weather.humidity}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                {selectedDay.humidity}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                {t.weather.wind}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                {selectedDay.windKmH} km/h
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                {t.weather.uvIndex}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                {selectedDay.uvIndex} of 10
              </span>
            </div>
          </div>

          {/* Hourly Forecast Timeline Strip */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.weather.hourlyTimeline}</span>
            </h4>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {selectedDay.hourly.map((h, i) => (
                <div key={i} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 font-mono">
                  <span className="text-[11px] text-slate-500 block">{h.time}</span>
                  <div className="my-1.5 flex justify-center">
                    {getWeatherIcon(h.condition as any, "w-5 h-5")}
                  </div>
                  <span className="font-bold text-slate-900 block text-xs">
                    {formatTemp(h.temp)}
                  </span>
                  {h.rainProbability > 0 && (
                    <span className="text-[10px] text-sky-600 block mt-0.5">
                      {h.rainProbability}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Activity Advice & Smart Packing Bridge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Expedition Timing Advice */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t.weather.activityRecommendation}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80">
              {selectedDay.activityAdvice}
            </p>
          </div>

          {/* Packing Advice with direct link to Smart Packing */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold uppercase tracking-wider">
              <Shirt className="w-4 h-4 text-indigo-600" />
              <span>{t.weather.packingAdvice}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-200/80">
              {selectedDay.packingTip}
            </p>

            {onGoToPacking && (
              <button
                onClick={onGoToPacking}
                className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Umbrella className="w-3.5 h-3.5 text-amber-400" />
                <span>Sync with Smart Packing List</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
