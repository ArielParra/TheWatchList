import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getCountFromServer
} from 'firebase/firestore';
import { Movie, TMDBMovie } from '../types';
import { genres } from './tmdbApi';

const MOVIES_COLLECTION = 'movies';

// Función para obtener el siguiente número de orden
const getNextOrderNumber = async (): Promise<number> => {
  try {
    const snapshot = await getCountFromServer(collection(db, MOVIES_COLLECTION));
    const count = snapshot.data().count;
    return count + 1;
  } catch (error) {
    //console.error('Error getting count:', error);
    // Si hay error, obtener todos los documentos y contar
    const querySnapshot = await getDocs(collection(db, MOVIES_COLLECTION));
    return querySnapshot.size + 1;
  }
};

export const addMovieToFirestore = async (tmdbMovie: TMDBMovie): Promise<string> => {
  try {
    //console.log('🔥 Firebase: Iniciando addMovieToFirestore');
    //console.log('📊 TMDB Movie data:', JSON.stringify(tmdbMovie, null, 2));

    // Verificar que db esté inicializado
    if (!db) {
      throw new Error('Firebase database no está inicializado');
    }

    // Obtener el siguiente número de orden
    const orderNumber = await getNextOrderNumber();
    //console.log('🔢 Número de orden asignado:', orderNumber);

    // Crear el objeto movie sin overview
    const movie: Omit<Movie, 'id'> = {
      title: tmdbMovie.title || 'Sin título',
      year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : new Date().getFullYear(),
      genre: tmdbMovie.genre_ids && tmdbMovie.genre_ids.length > 0 
        ? tmdbMovie.genre_ids.map(id => {
            const genre = genres.find(g => g.id === id);
            return genre ? genre.name : 'Unknown';
          }).join(', ') 
        : 'noGenre',
      rating: tmdbMovie.vote_average || 0,
      poster: tmdbMovie.poster_path || '',
      watched: false,
      tmdbId: tmdbMovie.id,
      orderNumber: orderNumber // ✅ Nuevo campo
    };

    //console.log('📋 Movie object to save:', JSON.stringify(movie, null, 2));

    // Intentar añadir el documento
    //console.log('💾 Añadiendo documento a Firestore...');
    //console.log('🗂️ Collection name:', MOVIES_COLLECTION);
    
    const docRef = await addDoc(collection(db, MOVIES_COLLECTION), movie);
    
    //console.log('✅ Documento añadido con ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    //console.error('❌ Firebase Error in addMovieToFirestore:', error);
    
    // Logging detallado del error
    if (error instanceof Error) {
      //console.error('Error name:', error.name);
      //console.error('Error message:', error.message);
      //console.error('Error stack:', error.stack);
    }
    
    // Log específico para errores de Firebase
    if ((error as any).code) {
      //console.error('Firebase error code:', (error as any).code);
    }
    
    throw error;
  }
};

export const getMoviesFromFirestore = async (): Promise<Movie[]> => {
  try {
    //console.log('🔍 Firebase: Obteniendo películas...');
    
    if (!db) {
      console.warn('⚠️ Database no inicializado, devolviendo array vacío');
      return [];
    }

    // Ordenar por número de orden (más recientes primero)
    const q = query(collection(db, MOVIES_COLLECTION), orderBy('orderNumber', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const movies = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Movie[];

    //console.log('✅ Películas obtenidas:', movies.length);
    //console.log('📋 Películas ordenadas por número:', movies.map(m => `${m.orderNumber}: ${m.title}`));
    
    return movies;
  } catch (error) {
    //console.error('❌ Firebase Error in getMoviesFromFirestore:', error);
    
    // Si hay error de conexión, devolver array vacío en lugar de lanzar error
    if ((error as any).code === 'unavailable' || (error as any).code === 'deadline-exceeded') {
      console.warn('⚠️ Problema de conexión, devolviendo array vacío');
      return [];
    }
    
    throw error;
  }
};

export const updateMovieWatchStatus = async (movieId: string, watched: boolean): Promise<void> => {
  try {
    //console.log('🔄 Actualizando estado watched:', { movieId, watched });
    
    if (!db) {
      throw new Error('Firebase database no está inicializado');
    }

    const movieRef = doc(db, MOVIES_COLLECTION, movieId);
    await updateDoc(movieRef, { watched });
    
    //console.log('✅ Estado actualizado correctamente');
  } catch (error) {
    //console.error('❌ Firebase Error in updateMovieWatchStatus:', error);
    throw error;
  }
};

export const deleteMovieFromFirestore = async (movieId: string): Promise<void> => {
  try {
    //console.log('🗑️ Eliminando película:', movieId);
    
    if (!db) {
      throw new Error('Firebase database no está inicializado');
    }

    await deleteDoc(doc(db, MOVIES_COLLECTION, movieId));
    
    //console.log('✅ Película eliminada correctamente');
  } catch (error) {
    //console.error('❌ Firebase Error in deleteMovieFromFirestore:', error);
    throw error;
  }
};