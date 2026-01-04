import {Request,Response,NextFunction} from 'express';
import { validationResult} from 'express-validator'
import * as authService from './auth.service';
import {RegisterDto,LoginDto} from './auth.types'

export async function register (req:Request,res:Response){
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})
    try{
        const payload = req.body as RegisterDto;
        const user=await authService.registerUser(payload)
        return res.status(200).json({user})
    }
    catch(err:any){
        return res.status(400).json({ error: err.message });
    }
}
export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body as LoginDto;
    const user = await authService.authenticateUser(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function profile(req: Request, res: Response) {
  const user = req.authUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const full = await authService.getUserById(user.id);
  return res.json({ user: full });
}

export async function updateProfile(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const user = req.authUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
const payload = req.body as {
  name?: string;
  phone?: string | null;
  address?: string | null;
  password?: string;
  dob?: string | null;
  gender?: string | null;
  ethnicity?: string | null;
  profession?: string | null;
  qualification?: string | null;
  province?: string | null;
  district?: string | null;
  municipality?: string | null;
  ward?: string | null;
};    
const updated = await authService.updateUser(user.id, payload);
    return res.json({ user: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function deleteAccount(req: Request, res: Response) {
  const user = req.authUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await authService.deleteUser(user.id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function updatePushToken(req: Request, res: Response) {
  const user = req.authUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { pushToken } = req.body as { pushToken: string };
    if (!pushToken) {
      return res.status(400).json({ error: 'Push token is required' });
    }

    const updated = await authService.updatePushToken(user.id, pushToken);
    return res.json({ success: true, user: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}