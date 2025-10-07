import type { Program } from "../types/loyalty"
import type { Customer } from "../types/customer"
import { api } from "./api.service"

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface DesignData {
  primaryColor?: string;
  textColor?: string;
  secondaryColor?: string;
  stampImage?: string;
}

// Utilidad para filtrar solo los campos permitidos por el backend
function filterProgramPayload(payload: any) {
  const allowed = [
    'name', 'description', 'type', 'pointsPerPurchase', 'requiredStamps', 'reward',
    'preFilledStamps', 'onCompleteBehavior', 'customStampIcon', 'stampImage',
    'primaryColor', 'textColor', 'secondaryColor', 'logoImage', 'backgroundImage',
    'usageLimits', 'termsAndConditions', 'expirationConfig', 'rewards'
  ];
  const filtered: any = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) filtered[key] = payload[key];
  }
  return filtered;
}

export const loyaltyService = {
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await api.get<ApiResponse<Program[]>>('api/loyalty/programs')
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor')
      }
      return response.data
    } catch (error) {
      console.error('Error fetching programs:', error)
      throw error
    }
  },

  async getProgramById(id: number): Promise<Program> {
    try {
      const response = await api.get<ApiResponse<Program>>(`api/loyalty/programs/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching program:', error)
      throw error
    }
  },

  async createProgram(program: any): Promise<Program> {
    try {
      const filtered = filterProgramPayload(program);
      const response = await api.post<ApiResponse<Program>>('api/loyalty/programs', {
        ...filtered,
        type: "stamps"
      })
      return response.data
    } catch (error: any) {
      // Solo logueamos errores que no sean de validación (400)
      if (!error.response || error.response.status !== 400) {
        console.error('Error creating program:', error)
      }
      throw error
    }
  },

  async updateProgram(id: number, program: any): Promise<Program> {
    try {
      const filtered = filterProgramPayload(program);
      const response = await api.patch<ApiResponse<Program>>(`api/loyalty/programs/${id}`, filtered)
      return response.data
    } catch (error) {
      console.error('Error updating program:', error)
      throw error
    }
  },

  async deleteProgram(id: number): Promise<void> {
    try {
      await api.delete(`api/loyalty/programs/${id}`)
    } catch (error) {
      console.error('Error deleting program:', error)
      throw error
    }
  },

  async updateProgramStatus(id: number, active: boolean): Promise<Program> {
    try {
      const response = await api.patch<ApiResponse<Program>>(`api/loyalty/programs/${id}/status`, { active })
      return response.data
    } catch (error) {
      console.error('Error updating program status:', error)
      throw error
    }
  },

  async updateProgramDesign(id: number, designData: DesignData): Promise<Program> {
    try {
      const response = await api.patch<ApiResponse<Program>>(`api/loyalty/programs/${id}/design`, designData)
      return response.data
    } catch (error) {
      console.error('Error updating program design:', error)
      throw error
    }
  },

  async getProgramStats(id: number): Promise<{
    totalCustomers: number;
    totalPoints: number;
    totalRedemptions: number;
  }> {
    try {
      const response = await api.get<ApiResponse<{
        totalCustomers: number;
        totalPoints: number;
        totalRedemptions: number;
      }>>(`api/loyalty/programs/${id}/stats`)
      return response.data
    } catch (error) {
      console.error('Error fetching program stats:', error)
      throw error
    }
  },

  async getProgramCustomers(programId: number): Promise<Customer[]> {
    try {
      const response = await api.get<ApiResponse<Customer[]>>(`api/loyalty/programs/${programId}/customers`)
      return response.data
    } catch (error) {
      console.error('Error fetching program customers:', error)
      throw error
    }
  },

  async getRewards(programId: number) {
    try {
      const response = await api.get<ApiResponse<any[]>>(`api/loyalty/programs/${programId}/rewards`)
      return response.data
    } catch (error) {
      console.error('Error fetching rewards:', error)
      throw error
    }
  },

  async createReward(programId: number, reward: any) {
    try {
      const response = await api.post<ApiResponse<any>>(`api/loyalty/programs/${programId}/rewards`, reward)
      return response.data
    } catch (error) {
      console.error('Error creating reward:', error)
      throw error
    }
  },

  async updateReward(programId: number, rewardId: number, reward: any) {
    try {
      const response = await api.patch<ApiResponse<any>>(`api/loyalty/programs/${programId}/rewards/${rewardId}`, reward)
      return response.data
    } catch (error) {
      console.error('Error updating reward:', error)
      throw error
    }
  },

  async deleteReward(programId: number, rewardId: number) {
    try {
      await api.delete(`api/loyalty/programs/${programId}/rewards/${rewardId}`)
    } catch (error) {
      console.error('Error deleting reward:', error)
      throw error
    }
  },

  async getShareLinks(programId: number) {
    try {
      const response = await api.get<ApiResponse<any[]>>(`api/loyalty/programs/${programId}/share-links`)
      return response.data
    } catch (error) {
      console.error('Error fetching share links:', error)
      throw error
    }
  },

  async createShareLink(programId: number, link: any) {
    try {
      const response = await api.post<ApiResponse<any>>(`api/loyalty/programs/${programId}/share-links`, link)
      return response.data
    } catch (error) {
      console.error('Error creating share link:', error)
      throw error
    }
  },

  async updateShareLink(programId: number, linkId: number, link: any) {
    try {
      const response = await api.patch<ApiResponse<any>>(`api/loyalty/programs/${programId}/share-links/${linkId}`, link)
      return response.data
    } catch (error) {
      console.error('Error updating share link:', error)
      throw error
    }
  },

  async deleteShareLink(programId: number, linkId: number) {
    try {
      await api.delete(`api/loyalty/programs/${programId}/share-links/${linkId}`)
    } catch (error) {
      console.error('Error deleting share link:', error)
      throw error
    }
  },

  async getCustomers(programId: number) {
    try {
      const response = await api.get<ApiResponse<any[]>>(`api/loyalty/programs/${programId}/customers`)
      return response.data
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  },

  async createCustomer(programId: number, customer: any) {
    try {
      const response = await api.post<ApiResponse<any>>(`api/loyalty/programs/${programId}/customers`, customer)
      return response.data
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  },

  async updateCustomer(programId: number, customerId: number, customer: any) {
    try {
      const response = await api.patch<ApiResponse<any>>(`api/loyalty/programs/${programId}/customers/${customerId}`, customer)
      return response.data
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  },

  async deleteCustomer(programId: number, customerId: number) {
    try {
      await api.delete(`api/loyalty/programs/${programId}/customers/${customerId}`)
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  },

  async getPushMessages(programId: number) {
    try {
      const response = await api.get<ApiResponse<any[]>>(`api/loyalty/programs/${programId}/push-messages`)
      return response.data
    } catch (error) {
      console.error('Error fetching push messages:', error)
      throw error
    }
  },

  async createPushMessage(programId: number, message: any) {
    try {
      const response = await api.post<ApiResponse<any>>(`api/loyalty/programs/${programId}/push-messages`, message)
      return response.data
    } catch (error) {
      console.error('Error creating push message:', error)
      throw error
    }
  },

  async updatePushMessage(programId: number, messageId: number, message: any) {
    try {
      const response = await api.patch<ApiResponse<any>>(`api/loyalty/programs/${programId}/push-messages/${messageId}`, message)
      return response.data
    } catch (error) {
      console.error('Error updating push message:', error)
      throw error
    }
  },

  async deletePushMessage(programId: number, messageId: number) {
    try {
      await api.delete(`api/loyalty/programs/${programId}/push-messages/${messageId}`)
    } catch (error) {
      console.error('Error deleting push message:', error)
      throw error
    }
  },
} 

