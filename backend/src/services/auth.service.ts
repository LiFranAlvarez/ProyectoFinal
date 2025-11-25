import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UsuarioRepository } from "../repositories/usuario.repositories";
import { Usuario } from "../models/usuario.js";

export class AuthService {
  private usuarioRepository = new UsuarioRepository();
  private JWT_SECRET = process.env.JWT_SECRET || "default_secret";

  async login(email: string, password: string) {
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) {
      throw new Error("Correo o contraseña incorrectos");
    }

    const passwordMatch = await bcrypt.compare(password, user.getPassword());
    if (!passwordMatch) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // *** ACÁ SE REPARA EL ERROR ***
    const token = jwt.sign(
      {
        id: user.getId(),
        email: user.getEmail(),
        rol: user.getRol()
      },
      this.JWT_SECRET,
      { expiresIn: "1h" }   // <<--- ESTO ESTÁ BIEN, SOLO FALLA SI el import es incorrecto
    );

    return { token, user };
  }
}

