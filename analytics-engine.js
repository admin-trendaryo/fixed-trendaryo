/**
 * Advanced Analytics Engine - Real-time Data Processing & Aggregation
 * Handles complex analytics calculations, predictions, and reporting
 */

class AnalyticsEngine {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.adminToken = localStorage.getItem('adminToken');
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // ==================== CORE ANALYTICS ====================

  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics(period = 'month') {
    const cacheKey = `dashboard_${period}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const [sales, customers, orders, revenue] = await Promise.all([
        this.getSalesMetrics(period),
        this.getCustomerMetrics(period),
        this.getOrderMetrics(period),
        this.getRevenueMetrics(period)
      ]);

      const metrics = {
        sales,
        customers,
        orders,
        revenue,
        timestamp: new Date()
      };

      this.cache.set(cacheKey, metrics);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheExpiry);

      return metrics;
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  /**
   * Get sales metrics
   */
  async getSalesMetrics(period) {
    const data = await this.apiRequest('/analytics/sales', { period });
    return {
      totalSales: data.totalSales || 0,
      avgDailySales: data.avgDailySales || 0,
      peakSalesDay: data.peakSalesDay || null,
      salesTrend: data.trend || [],
      growth: this.calculateGrowth(data.current, data.previous)
    };
  }

  /**
   * Get customer metrics
   */
  async getCustomerMetrics(period) {
    const data = await this.apiRequest('/analytics/customers', { period });
    return {
      totalCustomers: data.totalCustomers || 0,
      newCustomers: data.newCustomers || 0,
      returningCustomers: data.returningCustomers || 0,
      churnRate: data.churnRate || 0,
      retentionRate: data.retentionRate || 0,
      avgCustomerLifetimeValue: data.avgCLV || 0,
      growth: this.calculateGrowth(data.current, data.previous)
    };
  }

  /**
   * Get order metrics
   */
  async getOrderMetrics(period) {
    const data = await this.apiRequest('/analytics/orders', { period });
    return {
      totalOrders: data.totalOrders || 0,
      avgOrderValue: data.avgOrderValue || 0,
      medianOrderValue: data.medianOrderValue || 0,
      orderFrequency: data.orderFrequency || 0,
      repeatOrderRate: data.repeatOrderRate || 0,
      growth: this.calculateGrowth(data.current, data.previous)
    };
  }

  /**
   * Get revenue metrics
   */
  async getRevenueMetrics(period) {
    const data = await this.apiRequest('/analytics/revenue', { period });
    return {
      totalRevenue: data.totalRevenue || 0,
      avgDailyRevenue: data.avgDailyRevenue || 0,
      revenueBySource: data.bySource || {},
      revenueByCategory: data.byCategory || {},
      growth: this.calculateGrowth(data.current, data.previous)
    };
  }

  // ==================== ADVANCED ANALYTICS ====================

  /**
   * Get customer segmentation analysis
   */
  async getCustomerSegmentation() {
    try {
      const data = await this.apiRequest('/analytics/segmentation');
      return {
        segments: {
          vip: data.vip || { count: 0, revenue: 0, avgValue: 0 },
          loyal: data.loyal || { count: 0, revenue: 0, avgValue: 0 },
          atrisk: data.atrisk || { count: 0, revenue: 0, avgValue: 0 },
          inactive: data.inactive || { count: 0, revenue: 0, avgValue: 0 },
          new: data.new || { count: 0, revenue: 0, avgValue: 0 }
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error getting customer segmentation:', error);
      throw error;
    }
  }

  /**
   * Get product performance analysis
   */
  async getProductPerformance(limit = 20) {
    try {
      const data = await this.apiRequest('/analytics/products', { limit });
      return {
        topPerformers: (data.topPerformers || []).map(p => ({
          id: p.id,
          name: p.name,
          unitsSold: p.unitsSold,
          revenue: p.revenue,
          margin: p.margin,
          rating: p.rating,
          trend: p.trend
        })),
        underperformers: (data.underperformers || []).map(p => ({
          id: p.id,
          name: p.name,
          unitsSold: p.unitsSold,
          revenue: p.revenue,
          margin: p.margin,
          trend: p.trend
        })),
        timestamp: new Date()
      };
    } catch (error) {\n      console.error('Error getting product performance:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Get conversion funnel analysis\n   */\n  async getConversionFunnel() {\n    try {\n      const data = await this.apiRequest('/analytics/funnel');\n      return {\n        stages: {\n          visitors: data.visitors || 0,\n          addedToCart: data.addedToCart || 0,\n          initiatedCheckout: data.initiatedCheckout || 0,\n          completed: data.completed || 0\n        },\n        conversionRates: {\n          visitorToCart: this.calculateRate(data.addedToCart, data.visitors),\n          cartToCheckout: this.calculateRate(data.initiatedCheckout, data.addedToCart),\n          checkoutToComplete: this.calculateRate(data.completed, data.initiatedCheckout),\n          overall: this.calculateRate(data.completed, data.visitors)\n        },\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error getting conversion funnel:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Get cohort analysis\n   */\n  async getCohortAnalysis(cohortType = 'monthly') {\n    try {\n      const data = await this.apiRequest('/analytics/cohorts', { type: cohortType });\n      return {\n        cohorts: data.cohorts || [],\n        retentionMatrix: data.retentionMatrix || [],\n        avgRetention: data.avgRetention || 0,\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error getting cohort analysis:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Get RFM (Recency, Frequency, Monetary) analysis\n   */\n  async getRFMAnalysis() {\n    try {\n      const data = await this.apiRequest('/analytics/rfm');\n      return {\n        segments: {\n          champions: data.champions || [],\n          loyal: data.loyal || [],\n          potential: data.potential || [],\n          atrisk: data.atrisk || [],\n          lost: data.lost || []\n        },\n        distribution: data.distribution || {},\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error getting RFM analysis:', error);\n      throw error;\n    }\n  }\n\n  // ==================== PREDICTIVE ANALYTICS ====================\n\n  /**\n   * Forecast sales for next period\n   */\n  async forecastSales(periods = 12) {\n    try {\n      const data = await this.apiRequest('/analytics/forecast/sales', { periods });\n      return {\n        forecast: data.forecast || [],\n        confidence: data.confidence || 0.85,\n        trend: data.trend || 'stable',\n        seasonality: data.seasonality || [],\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error forecasting sales:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Predict customer churn\n   */\n  async predictChurn() {\n    try {\n      const data = await this.apiRequest('/analytics/predict/churn');\n      return {\n        atRiskCustomers: data.atRiskCustomers || [],\n        churnProbability: data.churnProbability || {},\n        recommendations: data.recommendations || [],\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error predicting churn:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Predict demand for products\n   */\n  async predictDemand(productId = null) {\n    try {\n      const params = productId ? { productId } : {};\n      const data = await this.apiRequest('/analytics/predict/demand', params);\n      return {\n        predictions: data.predictions || [],\n        confidence: data.confidence || 0.80,\n        recommendations: data.recommendations || [],\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error predicting demand:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Predict customer lifetime value\n   */\n  async predictCLV(customerId = null) {\n    try {\n      const params = customerId ? { customerId } : {};\n      const data = await this.apiRequest('/analytics/predict/clv', params);\n      return {\n        predictions: data.predictions || [],\n        segments: data.segments || {},\n        recommendations: data.recommendations || [],\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error predicting CLV:', error);\n      throw error;\n    }\n  }\n\n  // ==================== CUSTOM REPORTS ====================\n\n  /**\n   * Generate custom report\n   */\n  async generateCustomReport(config) {\n    try {\n      const data = await this.apiRequest('/analytics/reports/custom', {\n        method: 'POST',\n        body: JSON.stringify(config)\n      });\n      return {\n        reportId: data.reportId,\n        title: config.title,\n        data: data.data || [],\n        summary: data.summary || {},\n        generatedAt: new Date()\n      };\n    } catch (error) {\n      console.error('Error generating custom report:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Get saved reports\n   */\n  async getSavedReports() {\n    try {\n      const data = await this.apiRequest('/analytics/reports');\n      return data.reports || [];\n    } catch (error) {\n      console.error('Error getting saved reports:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Delete report\n   */\n  async deleteReport(reportId) {\n    try {\n      await this.apiRequest(`/analytics/reports/${reportId}`, {\n        method: 'DELETE'\n      });\n      return true;\n    } catch (error) {\n      console.error('Error deleting report:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Schedule report\n   */\n  async scheduleReport(config) {\n    try {\n      const data = await this.apiRequest('/analytics/reports/schedule', {\n        method: 'POST',\n        body: JSON.stringify(config)\n      });\n      return {\n        scheduleId: data.scheduleId,\n        nextRun: data.nextRun,\n        frequency: config.frequency\n      };\n    } catch (error) {\n      console.error('Error scheduling report:', error);\n      throw error;\n    }\n  }\n\n  // ==================== EXPORT & DISTRIBUTION ====================\n\n  /**\n   * Export report to PDF\n   */\n  async exportToPDF(reportId, filename) {\n    try {\n      const response = await fetch(`${this.apiBase}/analytics/reports/${reportId}/pdf`, {\n        headers: { 'Authorization': `Bearer ${this.adminToken}` }\n      });\n      const blob = await response.blob();\n      this.downloadFile(blob, `${filename}.pdf`);\n      return true;\n    } catch (error) {\n      console.error('Error exporting to PDF:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Export report to Excel\n   */\n  async exportToExcel(reportId, filename) {\n    try {\n      const response = await fetch(`${this.apiBase}/analytics/reports/${reportId}/excel`, {\n        headers: { 'Authorization': `Bearer ${this.adminToken}` }\n      });\n      const blob = await response.blob();\n      this.downloadFile(blob, `${filename}.xlsx`);\n      return true;\n    } catch (error) {\n      console.error('Error exporting to Excel:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Email report\n   */\n  async emailReport(reportId, recipients, subject) {\n    try {\n      await this.apiRequest(`/analytics/reports/${reportId}/email`, {\n        method: 'POST',\n        body: JSON.stringify({ recipients, subject })\n      });\n      return true;\n    } catch (error) {\n      console.error('Error emailing report:', error);\n      throw error;\n    }\n  }\n\n  // ==================== KPI & ALERTS ====================\n\n  /**\n   * Get KPI dashboard\n   */\n  async getKPIDashboard() {\n    try {\n      const data = await this.apiRequest('/analytics/kpis');\n      return {\n        kpis: data.kpis || [],\n        alerts: data.alerts || [],\n        timestamp: new Date()\n      };\n    } catch (error) {\n      console.error('Error getting KPI dashboard:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Set KPI alert\n   */\n  async setKPIAlert(kpiId, threshold, condition) {\n    try {\n      const data = await this.apiRequest('/analytics/kpis/alerts', {\n        method: 'POST',\n        body: JSON.stringify({ kpiId, threshold, condition })\n      });\n      return data;\n    } catch (error) {\n      console.error('Error setting KPI alert:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Get active alerts\n   */\n  async getActiveAlerts() {\n    try {\n      const data = await this.apiRequest('/analytics/alerts');\n      return data.alerts || [];\n    } catch (error) {\n      console.error('Error getting active alerts:', error);\n      throw error;\n    }\n  }\n\n  // ==================== UTILITY FUNCTIONS ====================\n\n  /**\n   * Calculate growth percentage\n   */\n  calculateGrowth(current, previous) {\n    if (!previous || previous === 0) return 0;\n    return ((current - previous) / previous * 100).toFixed(2);\n  }\n\n  /**\n   * Calculate conversion rate\n   */\n  calculateRate(numerator, denominator) {\n    if (!denominator || denominator === 0) return 0;\n    return ((numerator / denominator) * 100).toFixed(2);\n  }\n\n  /**\n   * Format currency\n   */\n  formatCurrency(amount, currency = 'USD') {\n    return new Intl.NumberFormat('en-US', {\n      style: 'currency',\n      currency: currency\n    }).format(amount);\n  }\n\n  /**\n   * Format percentage\n   */\n  formatPercentage(value) {\n    return `${parseFloat(value).toFixed(2)}%`;\n  }\n\n  /**\n   * Download file\n   */\n  downloadFile(blob, filename) {\n    const url = window.URL.createObjectURL(blob);\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = filename;\n    a.click();\n    window.URL.revokeObjectURL(url);\n  }\n\n  /**\n   * Make API request\n   */\n  async apiRequest(endpoint, options = {}) {\n    const headers = {\n      'Content-Type': 'application/json',\n      'Authorization': `Bearer ${this.adminToken}`,\n      ...options.headers\n    };\n\n    try {\n      const response = await fetch(`${this.apiBase}${endpoint}`, {\n        ...options,\n        headers\n      });\n\n      if (!response.ok) {\n        throw new Error(`API request failed: ${response.statusText}`);\n      }\n\n      return await response.json();\n    } catch (error) {\n      console.error('API request error:', error);\n      throw error;\n    }\n  }\n\n  /**\n   * Clear cache\n   */\n  clearCache() {\n    this.cache.clear();\n  }\n}\n\n// Initialize and expose globally\nwindow.AnalyticsEngine = new AnalyticsEngine();\n