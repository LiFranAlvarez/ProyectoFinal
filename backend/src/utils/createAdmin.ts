import Usuario from '../models/usuario.schema';
import userService from '../services/user.service';
const createAdmin = async () => {
    try {
        const cantUsers = await Usuario.estimatedDocumentCount();
        if (cantUsers > 0) return;
        const dni = 'ADMIN';
        
        userService.createOneUser(
            {
                nombre : 'ADMIN',
                email : 'ADMIN@ADMIN.COM',
                dni : 'ADMIN',
                rol : 'ADMIN'
            }
        );
        console.log('create Admin');
        
    } catch (error) {
        
    }
}
export default createAdmin;