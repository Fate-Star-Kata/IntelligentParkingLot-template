# 停车场管理系统 API 文档

## 概述

本文档描述了停车场管理系统的所有API接口，包括三个主要模块：
- `hzsystem_parking`: 停车场核心管理功能（包含完整的停车费管理API）
- `hzsystem_yolo`: YOLO车辆检测和车牌识别（使用YOLO+CNN技术栈）
- `hzsystem_websocket`: WebSocket实时通信和摄像头管理

### 核心技术特性

#### 车牌检测与识别 (YOLO + CNN)
- **YOLO模型**: 用于实时检测图像中的车牌区域，提供高精度的边界框定位
- **CNN模型**: 用于识别车牌区域内的字符，支持中文车牌和新能源车牌
- **实时处理**: 支持WebSocket视频流实时处理，车牌跟踪和状态管理
- **高准确率**: YOLO检测置信度 > 0.9，CNN字符识别准确率 > 95%

#### 停车费管理系统
- **灵活配置**: 支持多种费用配置方案（基础费用、小时费率、日最高费用等）
- **自动计算**: 根据停车时长自动计算费用，支持免费时长设置
- **支付集成**: 完整的支付订单管理，支持多种支付方式
- **统计分析**: 详细的收费统计和支付数据分析

## 基础信息

- **基础URL**: `http://localhost:8000/`
- **认证方式**: Django REST Framework Token认证
- **数据格式**: JSON
- **字符编码**: UTF-8
- **URL前缀**:
  - 停车场管理: `/hzsystem_parking/`
  - YOLO检测: `/hzsystem_yolo/`
  - WebSocket: `/hzsystem_websocket/`

---

## 0. 用户管理模块 (hzadmin)

### 0.1 用户停车偏好设置

#### 获取用户停车偏好
- **URL**: `/hzadmin_api/parking-preference/`
- **方法**: GET
- **描述**: 获取当前用户的停车偏好设置

**响应示例**:
```json
{
	"code": 200,
	"message": "获取成功",
	"data": {
		"license_plate": "京A12345",
		"preferred_area": "B区",
		"is_member": true,
		"member_since": "2025-08-14T10:01:07.984280",
		"auto_assign": false,
		"available_areas": [
			{
				"id": 1,
				"name": "A区",
				"description": "地下一层停车区"
			},
			{
				"id": 2,
				"name": "B区",
				"description": "地下二层停车区"
			},
			{
				"id": 3,
				"name": "C区",
				"description": "地面停车区"
			},
			{
				"id": 4,
				"name": "测试区域",
				"description": "测试用停车区域"
			}
		]
	}
}
```

#### 更新用户停车偏好
- **URL**: `/hzadmin_api/parking-preference/`
- **方法**: POST
- **描述**: 更新用户停车偏好设置

**请求参数**:
```json
{
  "license_plate": "京A12345",
  "preferred_area": "B区",
  "auto_assign": false
}
```

**响应示例**:
```json
{
	"code": 200,
	"message": "设置成功",
	"data": {
		"license_plate": "京A12345",
		"preferred_area": "B区",
		"is_member": true,
		"member_since": "2025-08-14T10:01:07.984280",
		"auto_assign": false
	}
}
```

### 0.2 用户会员管理

#### 获取用户会员状态
- **URL**: `/hzadmin_api/membership/`
- **方法**: GET
- **描述**: 获取用户会员状态信息

#### 更新用户会员状态
- **URL**: `/hzadmin_api/membership/`
- **方法**: POST
- **描述**: 更新用户会员状态

**请求参数**:
```json
{
  "is_member": true,
  "license_plate": "京A12345"
}
```

---

## 1. 停车场管理模块 (hzsystem_parking)

### 1.1 仪表盘接口

#### 获取仪表盘数据
- **URL**: `/hzsystem_parking/dashboard/`
- **方法**: GET
- **描述**: 获取停车场总体统计数据

**响应示例**:
```json
{
  "total_spots": 100,
  "occupied_spots": 45,
  "available_spots": 55,
  "occupancy_rate": 0.45,
  "today_revenue": 1250.50,
  "active_sessions": 45
}
```

#### 获取停车场布局
- **URL**: `/hzsystem_parking/dashboard/layout/`
- **方法**: GET
- **描述**: 获取停车场布局信息

**响应示例**:
```json
{
  "areas": [
    {
      "id": 1,
      "name": "A区",
      "spots": [
        {
          "id": 1,
          "number": "A001",
          "status": "occupied",
          "vehicle_type": "car"
        }
      ]
    }
  ]
}
```

### 1.2 停车区域管理

#### 获取停车区域列表
- **URL**: `/hzsystem_parking/parking-areas/`
- **方法**: GET
- **描述**: 获取所有停车区域

**响应示例**:
```json
{
  "areas": [
    {
      "id": 1,
      "name": "A区",
      "description": "地下一层停车区",
      "total_spots": 50,
      "available_spots": 25,
      "is_active": true,
      "created_time": "2024-01-01T00:00:00Z"
    }
  ],
  "total_count": 1
}
```

#### 创建停车区域
- **URL**: `/hzsystem_parking/parking-areas/`
- **方法**: POST
- **描述**: 创建新的停车区域

**请求参数**:
```json
{
  "name": "B区",
  "description": "地下二层停车区",
  "total_spots": 60
}
```

#### 获取停车区域详情
- **URL**: `/hzsystem_parking/parking-areas/{area_id}/`
- **方法**: GET
- **描述**: 获取指定停车区域详情

#### 更新停车区域
- **URL**: `/hzsystem_parking/parking-areas/{area_id}/`
- **方法**: PUT
- **描述**: 更新停车区域信息

#### 删除停车区域
- **URL**: `/hzsystem_parking/parking-areas/{area_id}/`
- **方法**: DELETE
- **描述**: 软删除停车区域

### 1.3 停车位管理

#### 获取停车位列表
- **URL**: `/hzsystem_parking/parking/spots/`
- **方法**: GET
- **描述**: 获取停车位列表

**查询参数**:
- `area_id`: 停车区域ID
- `status`: 停车位状态 (available/occupied/reserved/maintenance)
- `vehicle_type`: 车辆类型
- `page`: 页码
- `page_size`: 每页数量

**响应示例**:
```json
{
  "spots": [
    {
      "id": 1,
      "number": "A001",
      "area": {
        "id": 1,
        "name": "A区"
      },
      "status": "occupied",
      "vehicle_type": "car",
      "license_plate": "京A12345",
      "entry_time": "2024-01-01T10:00:00Z",
      "is_active": true
    }
  ],
  "total_count": 100,
  "page": 1,
  "page_size": 20
}
```

#### 创建停车位
- **URL**: `/hzsystem_parking/parking/spots/`
- **方法**: POST

**请求参数**:
```json
{
  "number": "A002",
  "area_id": 1,
  "spot_type": "standard"
}
```

#### 获取停车位详情
- **URL**: `/hzsystem_parking/parking/spots/{spot_id}/`
- **方法**: GET
- **描述**: 获取指定停车位详情

**响应示例**:
```json
{
	"spots": [
		{
			"id": 1,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A001",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.410626",
			"updated_time": "2025-08-13T15:34:52.989533"
		},
		{
			"id": 2,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A002",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.413625",
			"updated_time": "2025-08-14T10:17:01.938858"
		},
		{
			"id": 3,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A003",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.416626",
			"updated_time": "2025-08-14T10:17:02.157857"
		},
		{
			"id": 4,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A004",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.419626",
			"updated_time": "2025-08-14T10:17:02.744855"
		},
		{
			"id": 5,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A005",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.422627",
			"updated_time": "2025-08-14T10:17:02.954857"
		},
		{
			"id": 6,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A006",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.425630",
			"updated_time": "2025-08-14T10:17:03.158906"
		},
		{
			"id": 7,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A007",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.428629",
			"updated_time": "2025-08-14T10:17:03.352856"
		},
		{
			"id": 8,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A008",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.431629",
			"updated_time": "2025-08-13T15:30:15.431629"
		},
		{
			"id": 9,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A009",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.434424",
			"updated_time": "2025-08-13T15:30:15.434424"
		},
		{
			"id": 10,
			"area": 1,
			"area_name": "A区",
			"spot_number": "A010",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.437429",
			"updated_time": "2025-08-13T15:30:15.437429"
		},
		{
			"id": 11,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B001",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.440496",
			"updated_time": "2025-08-14T10:17:03.557855"
		},
		{
			"id": 12,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B002",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.443496",
			"updated_time": "2025-08-14T10:17:03.774029"
		},
		{
			"id": 13,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B003",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.446496",
			"updated_time": "2025-08-14T10:17:03.952029"
		},
		{
			"id": 14,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B004",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.449496",
			"updated_time": "2025-08-14T10:17:04.164028"
		},
		{
			"id": 15,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B005",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.452529",
			"updated_time": "2025-08-14T10:17:04.356029"
		},
		{
			"id": 16,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B006",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.455530",
			"updated_time": "2025-08-14T10:17:04.779027"
		},
		{
			"id": 17,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B007",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.458526",
			"updated_time": "2025-08-14T10:17:04.959027"
		},
		{
			"id": 18,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B008",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.461526",
			"updated_time": "2025-08-13T15:30:15.461526"
		},
		{
			"id": 19,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B009",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.464526",
			"updated_time": "2025-08-13T15:30:15.464526"
		},
		{
			"id": 20,
			"area": 2,
			"area_name": "B区",
			"spot_number": "B010",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.467529",
			"updated_time": "2025-08-13T15:30:15.467529"
		},
		{
			"id": 21,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C001",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.469525",
			"updated_time": "2025-08-14T10:17:05.171027"
		},
		{
			"id": 22,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C002",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.473526",
			"updated_time": "2025-08-14T10:17:05.357026"
		},
		{
			"id": 23,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C003",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.476526",
			"updated_time": "2025-08-14T10:17:05.539029"
		},
		{
			"id": 24,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C004",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.479526",
			"updated_time": "2025-08-14T10:17:05.814025"
		},
		{
			"id": 25,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C005",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.482526",
			"updated_time": "2025-08-14T10:17:06.144029"
		},
		{
			"id": 26,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C006",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.486092",
			"updated_time": "2025-08-14T10:17:06.538024"
		},
		{
			"id": 27,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C007",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.488092",
			"updated_time": "2025-08-14T10:17:06.943023"
		},
		{
			"id": 28,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C008",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.491092",
			"updated_time": "2025-08-13T15:30:15.491092"
		},
		{
			"id": 29,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C009",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.494092",
			"updated_time": "2025-08-13T15:30:15.494092"
		},
		{
			"id": 30,
			"area": 3,
			"area_name": "C区",
			"spot_number": "C010",
			"status": "occupied",
			"is_active": true,
			"created_time": "2025-08-13T15:30:15.497092",
			"updated_time": "2025-08-13T15:30:15.497092"
		}
	],
	"total_count": 30
}
```


#### 删除停车位
- **URL**: `/hzsystem_parking/parking/spots/{spot_id}/`
- **方法**: DELETE
- **描述**: 软删除停车位

#### 更新停车位状态
- **URL**: `/hzsystem_parking/parking/spots/{spot_id}/status/`
- **方法**: PUT
- **描述**: 更新停车位状态

**请求参数**:
```json
{
  "status": "occupied",
  "vehicle_type": "car",
  "license_plate": "京A12345"
}
```
#### 自动分配停车位
- **URL**: `/hzsystem_parking/parking/auto-assign/`
- **方法**: POST
- **描述**: 自动分配一个可用的停车位
```
**请求参数**:
```json
{
  "user_id": 1,
  "vehicle_type": "car",
  "license_plate": "京A12345"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "车位分配成功",
  "assigned_spot": {
    "id": 15,
    "number": "A015",
    "area_name": "A区"
  },
  "session_id": 123
}
```

### 1.4 检测记录管理

#### 获取检测记录列表
- **URL**: `/hzsystem_parking/detection/records/`
- **方法**: GET
- **描述**: 获取车辆检测记录

**查询参数**:
- `start_date`: 开始日期 (YYYY-MM-DD)
- `end_date`: 结束日期 (YYYY-MM-DD)
- `license_plate`: 车牌号
- `detection_type`: 检测类型
- `vehicle_type`: 车辆类型
- `spot_id`: 停车位ID
- `page`: 页码
- `page_size`: 每页数量

**响应示例**:
```json
{
	"records": [
		{
			"id": 10,
			"detection_time": "2025-08-13T15:30:15.573675",
			"detection_type": "vehicle_enter",
			"detection_type_display": "vehicle_enter",
			"vehicle_type": "car",
			"vehicle_type_display": "轿车",
			"confidence": 0.94,
			"license_plate": "川E33333",
			"image_url": "/media/detections/image_10.jpg",
			"spot": 10,
			"spot_info": "A区-A010"
		},
		{
			"id": 9,
			"detection_time": "2025-08-13T15:30:15.570676",
			"detection_type": "license_plate_recognition",
			"detection_type_display": "license_plate_recognition",
			"vehicle_type": "truck",
			"vehicle_type_display": "货车",
			"confidence": 0.9299999999999999,
			"license_plate": "粤D22222",
			"image_url": "/media/detections/image_9.jpg",
			"spot": 9,
			"spot_info": "A区-A009"
		},
		{
			"id": 8,
			"detection_time": "2025-08-13T15:30:15.567676",
			"detection_type": "vehicle_exit",
			"detection_type_display": "vehicle_exit",
			"vehicle_type": "suv",
			"vehicle_type_display": "SUV",
			"confidence": 0.9199999999999999,
			"license_plate": "沪C11111",
			"image_url": "/media/detections/image_8.jpg",
			"spot": 8,
			"spot_info": "A区-A008"
		},
		{
			"id": 7,
			"detection_time": "2025-08-13T15:30:15.564676",
			"detection_type": "vehicle_enter",
			"detection_type_display": "vehicle_enter",
			"vehicle_type": "car",
			"vehicle_type_display": "轿车",
			"confidence": 0.9099999999999999,
			"license_plate": "京B67890",
			"image_url": "/media/detections/image_7.jpg",
			"spot": 7,
			"spot_info": "A区-A007"
		},
		{
			"id": 6,
			"detection_time": "2025-08-13T15:30:15.561677",
			"detection_type": "license_plate_recognition",
			"detection_type_display": "license_plate_recognition",
			"vehicle_type": "truck",
			"vehicle_type_display": "货车",
			"confidence": 0.9,
			"license_plate": "京A12345",
			"image_url": "/media/detections/image_6.jpg",
			"spot": 6,
			"spot_info": "A区-A006"
		},
		{
			"id": 5,
			"detection_time": "2025-08-13T15:30:15.558676",
			"detection_type": "vehicle_exit",
			"detection_type_display": "vehicle_exit",
			"vehicle_type": "suv",
			"vehicle_type_display": "SUV",
			"confidence": 0.89,
			"license_plate": "川E33333",
			"image_url": "/media/detections/image_5.jpg",
			"spot": 5,
			"spot_info": "A区-A005"
		},
		{
			"id": 4,
			"detection_time": "2025-08-13T15:30:15.554676",
			"detection_type": "vehicle_enter",
			"detection_type_display": "vehicle_enter",
			"vehicle_type": "car",
			"vehicle_type_display": "轿车",
			"confidence": 0.88,
			"license_plate": "粤D22222",
			"image_url": "/media/detections/image_4.jpg",
			"spot": 4,
			"spot_info": "A区-A004"
		},
		{
			"id": 3,
			"detection_time": "2025-08-13T15:30:15.551676",
			"detection_type": "license_plate_recognition",
			"detection_type_display": "license_plate_recognition",
			"vehicle_type": "truck",
			"vehicle_type_display": "货车",
			"confidence": 0.87,
			"license_plate": "沪C11111",
			"image_url": "/media/detections/image_3.jpg",
			"spot": 3,
			"spot_info": "A区-A003"
		},
		{
			"id": 2,
			"detection_time": "2025-08-13T15:30:15.548676",
			"detection_type": "vehicle_exit",
			"detection_type_display": "vehicle_exit",
			"vehicle_type": "suv",
			"vehicle_type_display": "SUV",
			"confidence": 0.86,
			"license_plate": "京B67890",
			"image_url": "/media/detections/image_2.jpg",
			"spot": 2,
			"spot_info": "A区-A002"
		},
		{
			"id": 1,
			"detection_time": "2025-08-13T15:30:15.545676",
			"detection_type": "vehicle_enter",
			"detection_type_display": "vehicle_enter",
			"vehicle_type": "car",
			"vehicle_type_display": "轿车",
			"confidence": 0.85,
			"license_plate": "京A12345",
			"image_url": "/media/detections/image_1.jpg",
			"spot": 1,
			"spot_info": "A区-A001"
		}
	],
	"pagination": {
		"current_page": 1,
		"total_pages": 1,
		"total_count": 10,
		"page_size": 20,
		"has_next": false,
		"has_previous": false
	}
}
```

#### 获取检测统计
- **URL**: `/hzsystem_parking/detection/stats/`
- **方法**: GET
- **描述**: 获取检测统计数据

#### 实时监控
- **URL**: `/hzsystem_parking/detection/realtime/`
- **方法**: GET
- **描述**: 获取实时检测监控数据

**响应示例**:
```json
{
  "today_detections": 150,
  "week_detections": 1050,
  "month_detections": 4500,
  "vehicle_type_stats": {
    "car": 120,
    "motorcycle": 20,
    "truck": 10
  },
  "hourly_stats": [
    {"hour": 8, "count": 25},
    {"hour": 9, "count": 35}
  ]
}
```

### 1.5 费用管理

#### 获取费用配置列表
- **URL**: `/hzsystem_parking/fee/configs/`
- **方法**: GET
- **描述**: 获取所有停车费用配置

**响应示例**:
```json
{
  "fee_configs": [
    {
      "id": 1,
      "name": "标准收费",
      "base_fee": 5.00,
      "base_hours": 1.0,
      "hourly_rate": 3.00,
      "daily_max_fee": 30.00,
      "free_minutes": 15,
      "is_active": true,
      "created_time": "2024-01-01T00:00:00Z"
    }
  ],
  "total_count": 1
}
```

#### 创建费用配置
- **URL**: `/hzsystem_parking/fee/configs/`
- **方法**: POST
- **描述**: 创建新的费用配置

**请求参数**:
```json
{
  "name": "夜间收费",
  "base_fee": 3.00,
  "base_hours": 2.0,
  "hourly_rate": 2.00,
  "daily_max_fee": 20.00,
  "free_minutes": 30
}
```

#### 获取费用配置详情
- **URL**: `/hzsystem_parking/fee/configs/{config_id}/`
- **方法**: GET
- **描述**: 获取指定费用配置详情

#### 更新费用配置
- **URL**: `/hzsystem_parking/fee/configs/{config_id}/`
- **方法**: PUT
- **描述**: 更新费用配置信息

#### 删除费用配置
- **URL**: `/hzsystem_parking/fee/configs/{config_id}/`
- **方法**: DELETE
- **描述**: 软删除费用配置

#### 费用计算
- **URL**: `/hzsystem_parking/fee/calculate/`
- **方法**: POST
- **描述**: 根据停车会话计算停车费用

**请求参数**:
```json
{
  "session_id": "session_123456"
}
```

**响应示例**:
```json
{
  "session_id": "session_123456",
  "duration_hours": 2.5,
  "fee_config": {
    "id": 1,
    "name": "标准收费",
    "base_fee": 5.00,
    "hourly_rate": 3.00
  },
  "calculated_fee": "12.50",
  "calculation_time": "2024-01-01T12:30:00Z"
}
```

#### 获取费用模板
- **URL**: `/hzsystem_parking/fee/templates/`
- **方法**: GET
- **描述**: 获取费用配置模板

### 1.6 支付管理

#### 获取支付订单列表
- **URL**: `/hzsystem_parking/payment/orders/`
- **方法**: GET
- **描述**: 获取支付订单列表

**查询参数**:
- `payment_status`: 支付状态 (pending/completed/failed/refunded)
- `start_date`: 开始日期
- `end_date`: 结束日期
- `page`: 页码
- `page_size`: 每页数量

**响应示例**:
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD20240101001",
      "parking_session": {
        "session_id": "session_123456",
        "license_plate": "京A12345"
      },
      "amount": 15.00,
      "payment_status": "completed",
      "payment_method": "wechat",
      "created_time": "2024-01-01T10:00:00Z",
      "paid_time": "2024-01-01T10:05:00Z"
    }
  ],
  "total_count": 100,
  "page": 1,
  "page_size": 20
}
```

#### 创建支付订单
- **URL**: `/hzsystem_parking/payment/orders/`
- **方法**: POST
- **描述**: 为停车会话创建支付订单

**请求参数**:
```json
{
  "session_id": "session_123456"
}
```

**响应示例**:
```json
{
  "id": 1,
  "order_number": "ORD20240101001",
  "amount": 15.00,
  "payment_status": "pending",
  "created_time": "2024-01-01T10:00:00Z",
  "qr_code_url": "/static/qr_codes/ORD20240101001.png"
}
```

#### 处理支付
- **URL**: `/hzsystem_parking/payment/process/`
- **方法**: POST
- **描述**: 处理支付请求

**请求参数**:
```json
{
  "order_id": 1,
  "payment_method": "wechat",
  "amount": 15.00
}
```

#### 支付统计
- **URL**: `/hzsystem_parking/payment/stats/`
- **方法**: GET
- **描述**: 获取支付统计数据

**响应示例**:
```json
{
  "today_revenue": 1250.50,
  "week_revenue": 8750.00,
  "month_revenue": 35000.00,
  "total_orders": 500,
  "completed_orders": 480,
  "pending_orders": 15,
  "failed_orders": 5,
  "payment_method_stats": {
    "wechat": 300,
    "alipay": 150,
    "cash": 30
  }
}
```

#### 退款处理
- **URL**: `/hzsystem_parking/payment/refund/`
- **方法**: POST
- **描述**: 处理退款请求

**请求参数**:
```json
{
  "order_id": 1,
  "refund_amount": 15.00,
  "refund_reason": "用户申请退款"
}
```

### 1.7 系统日志管理

#### 获取系统日志列表
- **URL**: `/hzsystem_parking/system/logs/`
- **方法**: GET
- **描述**: 获取系统操作日志

**查询参数**:
- `start_date`: 开始日期
- `end_date`: 结束日期
- `log_level`: 日志级别 (INFO/WARNING/ERROR)
- `module`: 模块名称
- `page`: 页码
- `page_size`: 每页数量

**响应示例**:
```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2024-01-01T12:00:00Z",
      "level": "INFO",
      "module": "parking",
      "message": "车位状态更新成功",
      "user_id": 1,
      "ip_address": "192.168.1.100"
    }
  ],
  "total_count": 1000,
  "page": 1,
  "page_size": 20
}
```

#### 获取系统日志详情
- **URL**: `/hzsystem_parking/system/logs/{log_id}/`
- **方法**: GET
- **描述**: 获取指定日志详情

#### 获取日志统计
- **URL**: `/hzsystem_parking/system/logs/stats/`
- **方法**: GET
- **描述**: 获取日志统计数据

**响应示例**:
```json
{
  "total_logs": 5000,
  "today_logs": 150,
  "error_count_24h": 5,
  "warning_count_24h": 12,
  "level_distribution": {
    "INFO": 4500,
    "WARNING": 400,
    "ERROR": 100
  }
}
```

### 1.8 停车警报管理

#### 获取停车警报列表
- **URL**: `/hzsystem_parking/system/alerts/`
- **方法**: GET
- **描述**: 获取停车相关警报信息

**查询参数**:
- `alert_type`: 警报类型
- `status`: 警报状态 (active/resolved)
- `priority`: 优先级 (low/medium/high/critical)
- `start_date`: 开始日期
- `end_date`: 结束日期

**响应示例**:
```json
{
  "alerts": [
    {
      "id": 1,
      "alert_type": "overtime_parking",
      "title": "超时停车警报",
      "message": "车位A001超时停车3小时",
      "priority": "medium",
      "status": "active",
      "spot_id": 1,
      "license_plate": "京A12345",
      "created_at": "2024-01-01T12:00:00Z",
      "resolved_at": null
    }
  ],
  "total_count": 25,
  "page": 1,
  "page_size": 20
}
```

#### 获取警报详情
- **URL**: `/hzsystem_parking/system/alerts/{alert_id}/`
- **方法**: GET
- **描述**: 获取指定警报详情

#### 获取系统健康状态
- **URL**: `/hzsystem_parking/system/health/`
- **方法**: GET
- **描述**: 获取系统整体健康状态

**响应示例**:
```json
{
  "status": "healthy",
  "uptime": "5 days, 12 hours",
  "database_status": "connected",
  "cache_status": "active",
  "disk_usage": 45.2,
  "memory_usage": 67.8,
  "cpu_usage": 23.5,
  "active_sessions": 150,
  "last_check": "2024-01-01T12:00:00Z"
}
```

---

## 2. YOLO检测模块 (hzsystem_yolo)

### 2.1 车辆检测

#### 车辆检测接口
- **URL**: `/hzsystem_yolo/detect/`
- **方法**: POST
- **描述**: 使用YOLO模型进行车辆检测和车牌识别
- **Content-Type**: `multipart/form-data`

**请求参数**:
- `file`: 图片文件 (必需)
- `parking_spot_id`: 停车位ID (可选)

**响应示例**:
```json
{
  "success": true,
  "detections": {
    "car": 0.95,
    "motorcycle": 0.87
  },
  "license_plate": "京A12345",
  "result_image": "static/yolo/results2/20240101120000.jpg",
  "message": "车辆检测和车牌识别完成"
}
```

### 2.2 车牌检测和识别

#### 车牌检测接口
- **URL**: `/hzsystem_yolo/license-plate/detect/`
- **方法**: POST
- **描述**: 专门的车牌检测和字符识别接口
- **Content-Type**: `multipart/form-data`

**请求参数**:
- `image`: 图片文件 (必需)
- `plate_type`: 车牌类型 (0: 普通车牌, 1: 新能源车牌)

**响应示例**:
```json
{
  "success": true,
  "message": "成功检测到 1 个车牌",
  "results": [
    {
      "bbox": [100, 200, 300, 250],
      "yolo_confidence": 0.92,
      "plate_text": "京A12345",
      "char_details": [
        ["京", 0.95],
        ["A", 0.98],
        ["1", 0.96],
        ["2", 0.94],
        ["3", 0.97],
        ["4", 0.93],
        ["5", 0.95]
      ],
      "avg_char_confidence": 0.954
    }
  ],
  "detection_time": "2024-01-01T12:00:00Z"
}
```

**错误响应示例**:
```json
{
  "success": false,
  "message": "未检测到车牌"
}
```

### 2.3 模型管理

#### 获取模型信息
- **URL**: `/hzsystem_yolo/model/info/`
- **方法**: GET
- **描述**: 获取当前YOLO模型信息

**响应示例**:
```json
{
  "model_name": "yolov8n.pt",
  "model_size": "6.2MB",
  "classes": ["car", "motorcycle", "bus", "truck"],
  "input_size": [640, 640],
  "current_confidence_threshold": 0.5,
  "current_iou_threshold": 0.45,
  "settings_updated": "2024-01-01T12:00:00Z"
}
```

#### 获取模型性能统计
- **URL**: `/hzsystem_yolo/model/performance/`
- **方法**: GET
- **描述**: 获取模型检测性能统计

**响应示例**:
```json
{
  "overall_performance": [
    {
      "vehicle_type": "car",
      "total_detections": 1500,
      "avg_confidence": 0.923,
      "last_updated": "2024-01-01T12:00:00Z"
    }
  ],
  "recent_24h_stats": [
    {
      "vehicle_type": "car",
      "count_24h": 150,
      "avg_confidence_24h": 0.915
    }
  ],
  "total_detections_all_time": 5000,
  "total_detections_24h": 200
}
```

#### 获取模型设置
- **URL**: `/hzsystem_yolo/model/settings/`
- **方法**: GET
- **描述**: 获取当前模型设置

**响应示例**:
```json
{
  "model_name": "yolov8n.pt",
  "confidence_threshold": 0.5,
  "iou_threshold": 0.45,
  "max_detections": 100,
  "enable_vehicle_tracking": true,
  "tracking_threshold": 0.7,
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### 更新模型设置
- **URL**: `/hzsystem_yolo/model/settings/`
- **方法**: POST
- **描述**: 更新模型设置

**请求参数**:
```json
{
  "confidence_threshold": 0.6,
  "iou_threshold": 0.5,
  "max_detections": 50,
  "enable_vehicle_tracking": false
}
```

### 2.4 检测历史

#### 获取检测历史
- **URL**: `/hzsystem_yolo/detection/history/`
- **方法**: GET
- **描述**: 获取YOLO检测历史记录

**查询参数**:
- `start_date`: 开始日期
- `end_date`: 结束日期
- `vehicle_type`: 车辆类型
- `min_confidence`: 最小置信度
- `page`: 页码
- `page_size`: 每页数量

---

## 3. WebSocket通信模块 (hzsystem_websocket)

### 3.1 摄像头管理

#### 获取摄像头状态
- **URL**: `/hzsystem_websocket/camera/status/`
- **方法**: GET
- **描述**: 检查摄像头可用性和配置信息

**响应示例**:
```json
{
  "status": "available",
  "message": "摄像头可用",
  "camera_info": {
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "index": 0
  }
}
```

**摄像头不可用响应**:
```json
{
  "status": "unavailable",
  "message": "摄像头不可用",
  "camera_info": null
}
```

### 3.2 系统状态

#### 获取系统状态
- **URL**: `/hzsystem_websocket/system/status/`
- **方法**: GET
- **描述**: 获取系统整体运行状态

**响应示例**:
```json
{
  "status": "running",
  "message": "系统运行正常",
  "system_info": {
    "cpu_usage": 45.2,
    "memory_usage": 67.8,
    "disk_usage": 23.5,
    "uptime": "2 days, 5 hours",
    "active_connections": 15
  }
}
```

---

## 4. 错误处理

### 4.1 HTTP状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权访问
- `403 Forbidden`: 禁止访问
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误

### 4.2 错误响应格式

```json
{
  "error": "错误描述信息",
  "code": "ERROR_CODE",
  "details": {
    "field": "具体错误字段",
    "message": "详细错误信息"
  }
}
```

---

## 5. 认证和权限

### 5.1 Token认证

在请求头中包含认证Token：
```
Authorization: Token your_token_here
```

### 5.2 权限级别

- **管理员**: 所有接口访问权限
- **操作员**: 检测和记录相关接口
- **访客**: 只读接口权限

---

## 6. 限流和配额

- **检测接口**: 每分钟最多60次请求
- **查询接口**: 每分钟最多300次请求
- **文件上传**: 单个文件最大10MB

---

## 7. WebSocket接口

### 7.1 实时车牌检测推送 (YOLO + CNN)


**技术说明**:
- 使用 **YOLO模型** 进行车牌区域检测，支持多种车牌颜色（蓝色、绿色等）
- 使用 **CNN模型** 进行车牌字符识别
- 支持实时视频流处理和车牌跟踪
- 自动识别车牌类型和颜色

**发送消息格式** (客户端到服务器):
```json
{
  "type": "video_frame",
  "frame": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**接收消息格式** (服务器到客户端):
```json
{
  "type": "detection_result",
  "detections": [
    {
      "class_name": "blue",
      "confidence": 0.774,
      "bbox": {
        "x1": 100.0,
        "y1": 200.0,
        "x2": 300.0,
        "y2": 250.0
      },
      "class_id": 1,
      "license_number": "京A12345",
      "timestamp": 1704110400.123,
      "plate_type": "blue"
    }
  ],
  "license_plates": ["京A12345"],
  "frame_count": 150,
  "session_id": "uuid-session-id",
  "parking_spot_id": "1",
  "spot_status": "occupied"
}
```

**连接建立响应**:
```json
{
  "type": "connection_established",
  "message": "车牌检测连接已建立",
  "session_id": "uuid-session-id",
  "parking_spot_id": "1"
}
```

**支持的车牌类型**:
- `license_plate`: 通用车牌检测
- `blue`: 蓝色车牌（普通小型汽车）
- `green`: 绿色车牌（新能源汽车）

**其他消息类型**:
- `get_spot_status`: 获取车位状态
- `manual_update_status`: 手动更新车位状态
- `spot_status_updated`: 车位状态更新通知

### 7.2 系统状态推送

**连接URL**: `ws://localhost:8000/ws/system/`

**消息格式**:
```json
{
  "type": "system_status",
  "data": {
    "cpu_usage": 45.2,
    "memory_usage": 67.8,
    "active_sessions": 25,
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

---

## 8. 示例代码

### 8.1 Python示例

```python
import requests
import json

# 车辆检测示例
url = "http://localhost:8000/hzsystem_yolo/detect/"
files = {'file': open('car_image.jpg', 'rb')}
data = {'parking_spot_id': 1}

response = requests.post(url, files=files, data=data)
result = response.json()

print(f"检测结果: {result['detections']}")
print(f"车牌号: {result['license_plate']}")
```

### 8.2 JavaScript示例

```javascript
//# 获取停车位列表
fetch('/hzsystem_parking/parking-spots/', {
  method: 'GET',
  headers: {
    'Authorization': 'Token your_token_here',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('停车位列表:', data.spots);
})
.catch(error => {
  console.error('错误:', error);
});
```

---

## 9. 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 实现基础停车场管理功能
- 集成YOLO车辆检测
- 添加车牌识别功能
- 支持WebSocket实时通信

---

## 10. 联系信息

如有问题或建议，请联系开发团队。

**文档版本**: v1.0.0
**最后更新**: 2024-01-01
