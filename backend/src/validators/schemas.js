const { z } = require('zod');

const authSchema = {
    register: z.object({
        body: z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(6),
            role: z.enum(['ADMIN', 'STUDENT']).optional()
        })
    }),
    login: z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string().min(1)
        })
    })
};

const studentSchema = {
    register: z.object({
        body: z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(6),
            studentId: z.string(),
            courses: z.array(z.string()).optional()
        })
    }),
    create: z.object({ // Keep for legacy/manual linking if needed
        body: z.object({
            userId: z.string(),
            studentId: z.string(),
            courses: z.array(z.string()).optional()
        })
    })
};

const courseSchema = {
    create: z.object({
        body: z.object({
            title: z.string().min(3),
            fees: z.number().positive(),
            batch: z.string(),
            duration: z.string().optional()
        })
    })
};

module.exports = { authSchema, studentSchema, courseSchema };
