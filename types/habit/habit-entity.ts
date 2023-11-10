export interface HabitEntity {
    id?: string;
    createdAt: Date;
    title: string;
    description: string;
    userRepeatCount: number;
    totalRepeatCount: number;
    isActive: boolean | number;
    userId: string;
};
