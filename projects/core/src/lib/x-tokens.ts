import { InjectionToken } from '@angular/core';
import { ILogService } from './services/ILog.service';

export const OPEN_DEBUG_MODE = new InjectionToken<boolean>('开启调试模式，并在控制台打印调试信息。');
export const LOG_PROVIDER = new InjectionToken<ILogService>('日志服务提供者。');
