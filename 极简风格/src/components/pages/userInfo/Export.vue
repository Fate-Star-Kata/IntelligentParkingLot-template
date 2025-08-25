<template>
    <div class="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <!-- 背景装饰元素 -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        </div>

        <div class="relative w-full h-full flex gap-6 p-6">
            <!-- 左侧摄像头区域 -->
            <div class="h-full w-1/2">
                <div class="w-full h-full flex flex-col p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                    <!-- 标题和提示 -->
                    <div class="mb-8 text-center relative">
                        <!-- 装饰性图标 -->
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>

                        <div class="flex items-center justify-center mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </div>
                            <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">出场车牌识别</h2>
                        </div>

                        <div class="relative">
                            <p class="text-xl text-gray-600 font-medium">请将车辆停在摄像头前方</p>
                        </div>
                    </div>
                    <!-- 摄像头选择器 -->
                    <div class="mb-6">
                        <label class="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <div class="w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mr-2 flex items-center justify-center">
                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            选择摄像头设备
                        </label>
                        <div class="relative">
                            <select
                                v-model="selectedDeviceId"
                                @change="switchCamera"
                                class="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 appearance-none cursor-pointer hover:border-orange-400/50"
                            >
                                <option value="">🎥 请选择摄像头设备</option>
                                <option
                                    v-for="device in videoDevices"
                                    :key="device.deviceId"
                                    :value="device.deviceId"
                                >
                                    📹 {{ device.label || `摄像头 ${device.deviceId.slice(0, 8)}` }}
                                </option>
                            </select>
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- 视频显示区域 -->
                    <div class="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner border-2 border-gray-200/50">
                        <video
                            ref="videoRef"
                            autoplay
                            playsinline
                            muted
                            class="w-full h-full object-cover"
                            v-show="isVideoActive"
                        ></video>

                        <!-- 角落装饰 -->
                        <div class="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-orange-400 opacity-60" v-show="isVideoActive"></div>
                        <div class="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-orange-400 opacity-60" v-show="isVideoActive"></div>
                        <div class="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-orange-400 opacity-60" v-show="isVideoActive"></div>
                        <div class="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-orange-400 opacity-60" v-show="isVideoActive"></div>

                        <!-- 加载状态 -->
                        <div
                            v-if="isLoading"
                            class="absolute inset-0 bg-gradient-to-br from-orange-900/80 to-red-900/80 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div class="text-white text-center">
                                <div class="relative mb-6">
                                    <div class="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto"></div>
                                    <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-lg font-semibold">🎥 正在启动摄像头</p>
                                    <p class="text-sm text-orange-200">请稍候，正在连接设备...</p>
                                </div>
                            </div>
                        </div>

                        <!-- 错误状态 -->
                        <div
                            v-if="error"
                            class="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center"
                        >
                            <div class="text-center text-red-600 max-w-sm mx-auto p-6">
                                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold mb-2">⚠️ 摄像头启动失败</h3>
                                <p class="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{{ error }}</p>
                                <div class="space-x-2 space-y-2">
                                    <div class="flex flex-wrap gap-2 justify-center">
                                        <button
                                            @click="initCamera"
                                            class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            🔄 重新申请权限
                                        </button>
                                        <button
                                            @click="refreshPage"
                                            class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            🔃 刷新页面
                                        </button>
                                    </div>
                                    <div class="flex justify-center mt-2">
                                        <button
                                            @click="showCameraHelp"
                                            class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-md transition-all duration-200 text-xs font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                                        >
                                            📖 查看详细帮助
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="!isVideoActive && !isLoading && !error"
                            class="absolute inset-0 flex items-center justify-center bg-gray-100"
                        >
                            <p class="text-gray-500">请选择摄像头</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧区域 -->
               <div class="h-full w-1/2">
                   <div class="w-full h-full flex gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
                       <!-- 左侧区域 -->
                       <div class="w-1/2 h-full flex flex-col gap-3">
                           <!-- 车辆信息和停车时间合并卡片 - 始终显示 -->
                           <div class="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-3 border border-blue-200 overflow-hidden">
                               <!-- 车辆信息部分 -->
                               <div class="mb-4">
                                   <div class="flex items-center mb-2">
                                       <div 
                                           class="w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-all duration-300"
                                           :class="isDetecting ? 'bg-yellow-500 animate-pulse' : (vehicleInfo.plateNumber && vehicleInfo.plateNumber !== '未识别') ? 'bg-green-500' : 'bg-blue-500'"
                                       >
                                           <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                               <path v-if="isDetecting" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                               <path v-else-if="vehicleInfo.plateNumber && vehicleInfo.plateNumber !== '未识别'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                               <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                           </svg>
                                       </div>
                                       <h3 class="text-lg font-bold text-gray-800">
                                           {{ isDetecting ? '正在识别...' : (vehicleInfo.plateNumber && vehicleInfo.plateNumber !== '未识别') ? '识别完成' : '车牌识别结果' }}
                                       </h3>
                                   </div>

                                   <!-- 车牌号码显示 -->
                                   <div class="bg-white rounded-lg p-2 mb-2 shadow-inner border-2 border-dashed border-blue-300">
                                       <div class="text-center">
                                           <div class="text-xl font-bold tracking-wider font-mono" :class="vehicleInfo.plateNumber ? 'text-blue-700' : 'text-gray-400'">
                                    {{ vehicleInfo.plateNumber || '暂无数据' }}
                                </div>
                                           <div class="text-xs text-gray-500">
                                               {{ vehicleInfo.plateNumber ? vehicleInfo.plateNumberEn : 'License Plate Number' }}
                                           </div>
                                       </div>
                                   </div>

                                   <!-- 车辆详细信息 -->
                                   <div class="grid grid-cols-2 gap-2">
                                       <div class="bg-white/60 rounded-lg p-2">
                                           <span class="text-xs font-medium text-gray-700 block">车辆类型</span>
                                           <span class="text-sm font-bold" :class="vehicleInfo.vehicleType ? 'text-blue-600' : 'text-gray-400'">{{ vehicleInfo.vehicleType || '暂无数据' }}</span>
                                       </div>
                                       <div class="bg-white/60 rounded-lg p-2">
                                           <span class="text-xs font-medium text-gray-700 block">停车位置</span>
                                           <span class="text-sm font-bold" :class="vehicleInfo.parkingSpace ? 'text-blue-600' : 'text-gray-400'">{{ vehicleInfo.parkingSpace || '暂无数据' }}</span>
                                       </div>
                                   </div>
                               </div>

                               <!-- 停车时间部分 -->
                               <div>
                                   <div class="flex items-center mb-2">
                                       <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                           <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                           </svg>
                                       </div>
                                       <h3 class="text-lg font-bold text-gray-800">停车时间</h3>
                                   </div>

                                   <div class="grid grid-cols-2 gap-2 mb-2">
                                       <div class="bg-white/60 rounded-lg p-2">
                                           <span class="text-xs font-medium text-gray-700 block">入场时间</span>
                                           <span class="text-xs font-mono" :class="parkingTime.entryTime ? 'text-gray-800' : 'text-gray-400'">{{ parkingTime.entryTime || '暂无数据' }}</span>
                                       </div>
                                       <div class="bg-white/60 rounded-lg p-2">
                                           <span class="text-xs font-medium text-gray-700 block">出场时间</span>
                                           <span class="text-xs font-mono" :class="parkingTime.exitTime ? 'text-gray-800' : 'text-gray-400'">{{ parkingTime.exitTime || '暂无数据' }}</span>
                                       </div>
                                   </div>

                                   <div class="bg-white rounded-lg p-2 shadow-inner border-2 border-dashed border-green-300">
                                       <div class="text-center">
                                           <div class="text-lg font-bold" :class="parkingTime.duration ? 'text-green-700' : 'text-gray-400'">{{ parkingTime.duration || '暂无数据' }}</div>
                                           <div class="text-xs text-gray-500">{{ parkingTime.durationEn || 'Parking Duration' }}</div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                        </div>

                            <!-- 费用计算卡片 - 只有识别到车牌后才显示 -->
                             <div v-if="vehicleInfo.plateNumber" class="flex-1 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl shadow-lg p-3 border border-yellow-200 overflow-hidden">
                                <div class="flex items-center mb-2">
                                    <div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-800">费用计算</h3>
                                </div>

                                <div class="space-y-2">
                                    <div class="flex justify-between items-center bg-white/60 rounded-lg p-2">
                                        <span class="text-xs font-medium text-gray-700">{{ feeCalculation.baseFee.label }}</span>
                                        <span class="text-sm font-bold text-yellow-600">{{ feeCalculation.baseFee.amount }}</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-white/60 rounded-lg p-2">
                                        <span class="text-xs font-medium text-gray-700">{{ feeCalculation.overtimeFee.label }}</span>
                                        <span class="text-sm font-bold text-yellow-600">{{ feeCalculation.overtimeFee.amount }}</span>
                                    </div>
                                    <div class="bg-white rounded-lg p-2 shadow-inner border-2 border-dashed border-yellow-300">
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm font-bold text-gray-800">{{ feeCalculation.totalFee.label }}</span>
                                            <span class="text-xl font-bold text-yellow-700">{{ feeCalculation.totalFee.amount }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 等待识别提示卡片 - 未识别到车牌时显示 -->
                            <div v-else class="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-3 border border-gray-200 overflow-hidden flex items-center justify-center">
                                <div class="text-center text-gray-500">
                                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <p class="text-sm font-medium">等待车牌识别</p>
                                    <p class="text-xs text-gray-400 mt-1">识别成功后显示费用</p>
                                </div>
                            </div>
                        </div>

                        <!-- 右侧扫码支付卡片 - 只有识别到车牌后才显示 -->
                             <div v-if="vehicleInfo.plateNumber" class="w-1/2 h-full bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl shadow-lg p-4 border border-purple-200 overflow-hidden">
                            <div class="flex items-center mb-4">
                                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-gray-800">{{ paymentInfo.title }}</h3>
                            </div>

                            <!-- 二维码/支付成功区域 -->
                            <div class="bg-white rounded-lg p-8 mb-4 shadow-inner border-2 border-dashed" :class="isPaid ? 'border-green-300' : 'border-purple-300'">
                                <!-- 未支付状态 - 显示二维码 -->
                                <div v-if="!isPaid" class="text-center">
                                    <div class="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                        <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                        </svg>
                                    </div>
                                    <div class="text-sm text-gray-500">{{ paymentInfo.qrCodeText }}</div>
                                </div>

                                <!-- 支付成功状态 -->
                                <div v-else class="text-center">
                                    <div class="w-48 h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                        <div class="relative">
                                            <!-- 成功图标 -->
                                            <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                            <!-- 动画圆环 -->
                                            <div class="absolute inset-0 border-4 border-green-300 rounded-full animate-ping opacity-75"></div>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="text-xl font-bold text-green-700">支付成功！</div>
                                        <div class="text-sm text-gray-600">感谢您的使用，祝您出行愉快</div>
                                        <div class="text-xs text-gray-500">闸机将在3秒后自动开启</div>
                                    </div>
                                </div>
                            </div>

                            <div class="text-center text-sm text-gray-600 mb-4">
                                {{ paymentInfo.description }}
                            </div>

                            <div class="flex gap-3 mb-3">
                                <button
                                    v-for="button in paymentInfo.buttons"
                                    :key="button.text"
                                    :class="`flex-1 bg-${button.color}-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-${button.color}-600 transition-colors`"
                                >
                                    {{ button.text }}
                                </button>
                            </div>

                            <!-- 我已支付按钮 -->
                             <div v-if="!isPaid" class="mt-3">
                                 <button
                                     @click="handlePaymentConfirm"
                                     class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                                 >
                                     <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                     </svg>
                                     我已支付
                                 </button>
                             </div>

                             <!-- 支付成功后的操作按钮 -->
                             <div v-else class="mt-3 space-y-2">
                                 <button
                                     @click="handleExitGate"
                                     class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                                 >
                                     <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                     </svg>
                                     开启闸机出场
                                 </button>
                                 <button
                                     @click="resetPayment"
                                     class="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                                 >
                                     重新支付
                                 </button>
                             </div>
                        </div>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import WebSocketClient from '@/http/WebSocket'
import { autoAssignParkingSpot, getParkingLayout } from '@/api/user/parking'
import { useUserStore } from '@/stores/auth/user'

// 响应式数据
const videoRef = ref<HTMLVideoElement | null>(null)
const videoDevices = ref<MediaDeviceInfo[]>([])
const selectedDeviceId = ref<string>('')
const currentStream = ref<MediaStream | null>(null)
const isVideoActive = ref(false)
const isLoading = ref(false)
const error = ref<string>('')
const isPaid = ref<boolean>(false) // 支付状态

// WebSocket相关
const wsClient = ref<WebSocketClient | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let frameInterval: number | null = null

// 车牌检测结果相关
const detectionResult = ref<any>(null)
const licensePlate = ref<string>('')
const confidence = ref<number>(0)
const vehicleType = ref<string>('')
const entryTime = ref<string>('')
const exitTime = ref<string>('')
const sessionId = ref<string>('')
const isDetecting = ref<boolean>(false)

// 车辆信息数据
const vehicleInfo = ref({
    plateNumber: '',
    plateNumberEn: 'License Plate Number',
    vehicleType: '',
    parkingSpace: '',
    confidence: 0,
    confidenceColor: 'gray'
})

// 停车时间数据
const parkingTime = ref({
    entryTime: '',
    exitTime: '',
    duration: '',
    durationEn: 'Total Parking Duration'
})

// 费用计算数据
const feeCalculation = ref({
    baseFee: {
        label: '基础费用 (2小时)',
        amount: '¥10.00'
    },
    overtimeFee: {
        label: '超时费用 (15分钟)',
        amount: '¥2.00'
    },
    totalFee: {
        label: '应付总额',
        amount: '¥12.00'
    }
})

// 支付信息数据
const paymentInfo = ref({
    title: '扫码支付',
    qrCodeText: '支付二维码',
    description: '使用微信或支付宝扫码支付停车费',
    buttons: [
        { text: '微信支付', color: 'green' },
        { text: '支付宝', color: 'blue' }
    ]
})

// 获取父组件的用户信息
const parentUserInfo = inject('userMembershipInfo', ref({
    is_member: false,
    license_plate: '',
    preferred_area: ''
}))

// 获取用户存储
const userStore = useUserStore()

// 申请摄像头权限
const requestCameraPermission = async () => {
    try {
        // 检查浏览器是否支持 getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            error.value = '您的浏览器不支持摄像头功能，请使用现代浏览器（Chrome、Firefox、Safari等）'
            return false
        }

        // 先申请一个基本的摄像头权限，这样可以获取到设备标签
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        // 立即停止这个临时流
        stream.getTracks().forEach(track => track.stop())
        return true
    } catch (err) {
        console.error('申请摄像头权限失败:', err)
        if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
                error.value = '摄像头权限被拒绝。请按以下步骤操作：\n1. 点击地址栏左侧的摄像头图标\n2. 选择"允许"访问摄像头\n3. 刷新页面重试'
            } else if (err.name === 'NotFoundError') {
                error.value = '未找到摄像头设备，请确保：\n1. 摄像头已正确连接\n2. 没有被其他应用占用\n3. 驱动程序已安装'
            } else if (err.name === 'NotReadableError') {
                error.value = '摄像头被其他应用占用，请：\n1. 关闭其他使用摄像头的应用\n2. 重新连接摄像头\n3. 刷新页面重试'
            } else if (err.name === 'OverconstrainedError') {
                error.value = '摄像头不支持请求的配置，请尝试使用其他摄像头设备'
            } else {
                error.value = `权限申请失败: ${err.message}`
            }
        } else {
            error.value = '权限申请失败，请检查摄像头设备和浏览器设置'
        }
        return false
    }
}

// 获取可用的摄像头设备
const getVideoDevices = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        videoDevices.value = devices.filter(device => device.kind === 'videoinput')

        // 如果有设备且没有选择设备，自动选择第一个
        if (videoDevices.value.length > 0 && !selectedDeviceId.value) {
            selectedDeviceId.value = videoDevices.value[0].deviceId
        }
    } catch (err) {
        console.error('获取设备列表失败:', err)
        error.value = '无法获取摄像头设备列表'
    }
}

// 停止当前流
const stopCurrentStream = () => {
    if (currentStream.value) {
        currentStream.value.getTracks().forEach(track => track.stop())
        currentStream.value = null
    }
    isVideoActive.value = false
}

// 启动摄像头
const startCamera = async (deviceId: string) => {
    isLoading.value = true
    error.value = ''

    try {
        // 停止之前的流
        stopCurrentStream()

        // 获取新的媒体流
        const constraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        }

        currentStream.value = await navigator.mediaDevices.getUserMedia(constraints)

        if (videoRef.value) {
            videoRef.value.srcObject = currentStream.value
            isVideoActive.value = true
        }
    } catch (err) {
        console.error('摄像头启动失败:', err)
        if (err instanceof Error) {
            error.value = `摄像头启动失败: ${err.message}`
        } else {
            error.value = '摄像头启动失败'
        }
    } finally {
        isLoading.value = false
    }
}

// 切换摄像头
const switchCamera = () => {
    if (selectedDeviceId.value) {
        startCamera(selectedDeviceId.value)
    }
}

// 刷新页面
const refreshPage = () => {
    window.location.reload()
}

// 显示摄像头帮助信息
const showCameraHelp = () => {
    const helpMessage = `摄像头权限问题解决方案：

🌐 Chrome浏览器：
1. 点击地址栏左侧的锁形图标或摄像头图标
2. 将摄像头权限设置为"允许"
3. 刷新页面

🦊 Firefox浏览器：
1. 点击地址栏左侧的盾牌图标
2. 关闭"阻止摄像头访问"
3. 刷新页面

🧭 Safari浏览器：
1. 在菜单栏选择"Safari" > "网站设置"
2. 找到摄像头选项，设置为"允许"
3. 刷新页面

💡 其他解决方案：
• 确保摄像头设备正常连接
• 关闭其他使用摄像头的应用程序
• 重启浏览器或计算机
• 检查防火墙和安全软件设置

如果问题仍然存在，请联系技术支持。`

    alert(helpMessage)
}

// 初始化摄像头
const initCamera = async () => {
    // 首先申请摄像头权限
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
        return
    }

    // 权限申请成功后获取设备列表
    await getVideoDevices()
    if (selectedDeviceId.value) {
        await startCamera(selectedDeviceId.value)
    }
}

// 初始化WebSocket连接
const initWebSocket = () => {
    wsClient.value = new WebSocketClient('ws://192.168.124.3:8002/ws/vehicle-detection/', {
        onOpen: () => {
            console.log('WebSocket连接成功')
            startFrameCapture()
        },
        onMessage: (data) => {
            console.log('收到WebSocket消息:', data)
            handleWebSocketMessage(data)
        },
        onClose: (event) => {
            console.log('WebSocket连接关闭:', event)
            stopFrameCapture()
        },
        onError: (event) => {
            console.error('WebSocket连接错误:', event)
        }
    }, {
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        heartbeatInterval: 30000
    })

    wsClient.value.connect()
}

// 捕获视频帧并转换为base64
const captureFrame = (): string | null => {
    if (!videoRef.value || !isVideoActive.value) {
        return null
    }

    // 创建canvas元素（如果不存在）
    if (!canvasRef.value) {
        canvasRef.value = document.createElement('canvas')
    }

    const canvas = canvasRef.value
    const video = videoRef.value
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    // 设置canvas尺寸与视频相同
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 绘制当前视频帧到canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // 转换为base64
    try {
        return canvas.toDataURL('image/jpeg', 0.8).split(',')[1] // 移除data:image/jpeg;base64,前缀
    } catch (err) {
        console.error('转换图像为base64失败:', err)
        return null
    }
}

// 开始帧捕获（每秒5次）
const startFrameCapture = () => {
    if (frameInterval) {
        clearInterval(frameInterval)
    }

    frameInterval = setInterval(() => {
        const frameBase64 = captureFrame()
        if (frameBase64 && wsClient.value?.isConnected()) {
            const message = {
                type: 'video_frame',
                frame: frameBase64
            }
            wsClient.value.send(message)
        }
    }, 200) // 每200ms发送一次，即每秒5次
}

// 停止帧捕获
const stopFrameCapture = () => {
    if (frameInterval) {
        clearInterval(frameInterval)
        frameInterval = null
    }
}

// 处理WebSocket消息
const handleWebSocketMessage = (data: any) => {
    try {
        const message = typeof data === 'string' ? JSON.parse(data) : data

        switch (message.type) {
            case 'connection_established':
                console.log('连接已建立:', message.message)
                sessionId.value = message.session_id || ''
                break

            case 'detection_result':
                handleDetectionResult(message)
                break

            case 'exit_processing':
                handleExitProcessing(message)
                break

            case 'error':
                console.error('WebSocket错误:', message.message)
                break

            default:
                console.log('未知消息类型:', message.type)
        }
    } catch (err) {
        console.error('解析WebSocket消息失败:', err)
    }
}

// 处理车牌检测结果
const handleDetectionResult = async (message: any) => {
    isDetecting.value = true
    detectionResult.value = message

    // 更新车牌信息
    if (message.license_plates && message.license_plates.length > 0) {
        licensePlate.value = message.license_plates[0]
        vehicleInfo.value.plateNumber = message.license_plates[0]
    }

    // 更新检测详情
    if (message.detections && message.detections.length > 0) {
        const detection = message.detections[0]
        confidence.value = Math.round(detection.confidence * 100)
        vehicleInfo.value.confidence = confidence.value

        // 根据检测类型设置车辆类型
        switch (detection.class_name) {
            case 'blue':
            case 'license_plate':
                vehicleType.value = '小型汽车'
                break
            case 'green':
                vehicleType.value = '新能源汽车'
                break
            default:
                vehicleType.value = '未知类型'
        }
        vehicleInfo.value.vehicleType = vehicleType.value
    }

    // 更新出场时间
    exitTime.value = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
    parkingTime.value.exitTime = exitTime.value

    // 计算停车时长和费用
    calculateParkingFee()
}

// 处理出场处理结果
const handleExitProcessing = (message: any) => {
    if (message.parking_record) {
        const record = message.parking_record
        parkingTime.value.entryTime = record.entry_time || parkingTime.value.entryTime
        parkingTime.value.exitTime = record.exit_time || exitTime.value
        parkingTime.value.duration = record.duration || parkingTime.value.duration

        // 更新费用信息
        if (record.fee_info) {
            feeCalculation.value.baseFee.amount = `¥${record.fee_info.base_fee || '0.00'}`
            feeCalculation.value.overtimeFee.amount = `¥${record.fee_info.overtime_fee || '0.00'}`
            feeCalculation.value.totalFee.amount = `¥${record.fee_info.total_fee || '0.00'}`
        }
    }
}

// 计算停车费用
const calculateParkingFee = () => {
    // 这里可以添加实际的费用计算逻辑
    // 目前使用模拟数据
    const baseFee = 10.00
    const overtimeFee = 2.00
    const totalFee = baseFee + overtimeFee

    feeCalculation.value.baseFee.amount = `¥${baseFee.toFixed(2)}`
    feeCalculation.value.overtimeFee.amount = `¥${overtimeFee.toFixed(2)}`
    feeCalculation.value.totalFee.amount = `¥${totalFee.toFixed(2)}`
}

// 处理支付确认
const handlePaymentConfirm = () => {
    isPaid.value = true
}

// 处理开启闸机
const handleExitGate = () => {
    // 这里可以添加实际的闸机控制逻辑
    console.log('开启闸机，允许车辆出场')
    // 可以添加API调用来控制实际的闸机设备

    // 发送出场确认消息到WebSocket
    if (wsClient.value?.isConnected()) {
        const message = {
            type: 'exit_confirmed',
            license_plate: licensePlate.value,
            session_id: sessionId.value
        }
        wsClient.value.send(message)
    }
}

// 重置支付状态
const resetPayment = () => {
    isPaid.value = false
}

// 关闭WebSocket连接
const closeWebSocket = () => {
    stopFrameCapture()
    if (wsClient.value) {
        wsClient.value.close()
        wsClient.value = null
    }
}

// 组件挂载时初始化
onMounted(() => {
    initCamera()
    initWebSocket()
})

// 组件卸载时清理资源
onUnmounted(() => {
    stopCurrentStream()
    closeWebSocket()
})
</script>

<style scoped>
/* 自定义样式 */
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .5;
    }
}
</style>
