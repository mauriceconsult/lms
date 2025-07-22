import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ facultyId: string; courseId: string }> }) {
    try {
        const { facultyId, courseId } = await params;
        const { amount } = await req.json();

        if (!facultyId || !courseId) {
            return NextResponse.json({ message: 'Invalid facultyId or courseId' }, { status: 400 });
        }

        const course = await prisma.course.findFirst({
            where: {
                id: courseId,             
            },
        });

        if (!course) {
            return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        }

        if (amount !== null && (typeof amount !== 'string' || isNaN(Number(amount)))) {
            return NextResponse.json({ message: 'Invalid amount: must be a string representing a number or null' }, { status: 400 });
        }

        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                amount: amount,
            },
        });

        return NextResponse.json(updatedCourse, { status: 200 });
    } catch (error) {
        console.error('Update course amount error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
