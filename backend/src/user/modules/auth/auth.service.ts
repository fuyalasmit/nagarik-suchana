import bcrypt from 'bcryptjs';
import prisma from '../../config/database'
import {RegisterDto} from './auth.types'

const Salt=10;

export async function registerUser(data:RegisterDto){
    const existing= await prisma.user.findUnique(
        {
            where:{email:data.email}
        }
    )
    if (existing) throw new Error ('User already Exists')
    const hashed =await bcrypt.hash(data.password,Salt);
    const user = await prisma.user.create({
        data:{
            name: data.name,
      email: data.email,
      password: hashed,
      phone: data.phone,
      address: data.address,
        },
        select: { id: true, email: true, name: true, phone: true, address: true, createdAt: true },
    });
    return user
}
export async function authenticateUser(email:string,password:string){
    const user = await prisma.user.findUnique(
        {
            where:{
                email
            }
        }
    ) 
    if (!user) return null;
    const ok=await bcrypt.compare(password,user.password)
    if(!ok) return null;
    return {
        id:user.id,
        email:user.email,
        name:user.name,
    }
}
export async function getUserById(id:string){
    return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, phone: true, address: true, createdAt: true },
  });
}
export async function updateUser(id: string, data: { name?: string; phone?: string; address?: string; password?: string; }) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, Salt);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, name: true, phone: true, address: true, createdAt: true, updatedAt: true },
  });

  return user;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  return true;
}