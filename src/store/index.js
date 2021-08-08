import Vue from 'vue'
import Vuex from 'vuex'
import jwtdecode from 'jwt-decode'
import router from '../router'


Vue.use(Vuex)

export default new Vuex.Store({
    state: { //Creo las variables que son solo de lectura
        token: '',
        user: '',
        existe: 0,
        ubicacion:'',
        icono:'',
        color:''
    },
    mutations: {//creo las mutaciones para cambiar el valor de las variables del estado
        setToken(state, token) {//con state accedo a las variables del estado y con el token accedo al valor que devolvio el back al momento de loguearme
            state.token = token;
        },
        setUsuario(state, usuario) {//usuario es donde vamos a tener el token decodificado
            state.user = usuario
        },
        setExistetoken(state, existe) {//Se define si existe el token o no
            state.existe = existe
        },
        setUbicacion(state,{ubicacion, icono,color}){
            state.ubicacion = ubicacion
            state.icono = icono
            state.color = color
        },

    },
    actions: {//Las acciones hacen los llamados a las mutaciones
        guardarToken({ commit }, token) {//el commit es algo que se recibe para confirmar las llamadas a mutaciones
            commit("setToken", token);
            commit("setUsuario", jwtdecode(token));
            localStorage.setItem('token', token);
        },
        autoLogin({ commit }) {//este metodo verifica que el usuario ya esté logueado para no pedirle mas token, solo recibe el coomit ya que solo verifico que dentro de el localstorage esté el token y si está, lo seteamos
            const token = localStorage.getItem('token');
            if (token) {
                const iniciotoken = new Date(jwtdecode(token).iat*1000);
                const finaltoken = new Date(jwtdecode(token).exp*1000);
                const horaactual= new Date();
                const restatoken = horaactual - iniciotoken
/*                 console.log(finaltoken)
                console.log(iniciotoken)
                console.log(horaactual)
                console.log(restatoken) */
                if (restatoken < 1800000) {
                    commit("setToken", token);
                    commit("setUsuario", jwtdecode(token));
                    commit("setExistetoken", 1);
                } else {
                    commit("setExistetoken", 0);
                    return false;
                    
                }

            } else {
                commit("setExistetoken", 0);
                return false;
            }
        },
        salir({ commit }) {//para borrar los datos y devolver el usuario a Home
            commit("setToken", null);
            commit("setUsuario", null);
            localStorage.removeItem('token');
            router.push({ name: 'Login' });
        },
        guardarUbicacion({ commit }, {ubicacion, icono,color}) {//el commit es algo que se recibe para confirmar las llamadas a mutaciones
            commit("setUbicacion", {ubicacion, icono,color});
            
        },
    }
})