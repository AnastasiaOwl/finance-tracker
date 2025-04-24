jest.mock('@/firebase/firebaseConfig', ()=> ({
    db: {},
    auth: {},
    googleProvider: {},
}));

import {
    addCategoryAsync,
    deleteCategoryAsync,
    fetchCategoryAsync,
} from '../redux/categoryActions';
import {
    addCategory,
    setCategories,
    deleteCategory,
    Category,
} from '../redux/categorySlice';
import * as api from '../firebase/firebaseApi';
import type { AppDispatch } from '../redux/store';

jest.mock('@/firebase/firebaseApi');

describe('CategoryActions async thunks', ()=>{
    let dispatch: jest.MockedFunction<AppDispatch>;
    const baseCategory: Omit<Category, 'id'> = {
        type: "Дохід",
        name: "репетиторство",
    };

    beforeEach(()=>{
        dispatch =jest.fn() as jest.MockedFunction<AppDispatch>;
        jest.clearAllMocks();
    });

    describe('addCategoryAsync', ()=>{
        it('dispatches addCategory and returns new ID', async () => {
            (api.addCategoryToFirestore as jest.Mock).mockResolvedValue('123');
            const result = await addCategoryAsync(baseCategory)(dispatch);
            expect(api.addCategoryToFirestore).toHaveBeenCalledWith(baseCategory);
            expect(dispatch).toHaveBeenCalledWith(
              addCategory({ ...baseCategory, id: 123 })
            );
            expect(result).toBe(123);
        });  
        
        it('logs error on failure without dispatch', async () => {
            const error = new Error('fail');
            (api.addCategoryToFirestore as jest.Mock).mockRejectedValue(error);
            console.error = jest.fn();
            try {
              await addCategoryAsync(baseCategory)(dispatch);
            } catch {
            }
            expect(console.error).toHaveBeenCalledWith(
              '❌ Error adding category:',
              error
            );
            expect(dispatch).not.toHaveBeenCalled();
        });
          
    })

    describe('deleteCategoryAsync', ()=>{
          it('dispatches deleteCategory and logs success', async ()=>{
            const id = '1';
            (api.deleteCategoryFirestore as jest.Mock).mockResolvedValue(undefined);
            console.log = jest.fn();

            await deleteCategoryAsync(id)(dispatch);

            expect(api.deleteCategoryFirestore).toHaveBeenCalledWith(id);
            expect(dispatch).toHaveBeenCalledWith(deleteCategory(id));
            expect(console.log).toHaveBeenCalledWith(
                '✅ Category deleted from Redux and Firestore'
            );
          });
          it('logs error on failure without dispatch', async ()=>{
            const error = new Error ('fail-delete');
            const id = '1';
            (api.deleteCategoryFirestore as jest.Mock).mockRejectedValue(error);
            console.error = jest.fn();

            await deleteCategoryAsync(id)(dispatch);

            expect(console.error).toHaveBeenCalledWith(
                '❌ Error deleting category:',
                error
            );
            expect(dispatch).not.toHaveBeenCalled();
          });
    });


    describe('fetchCategoryAsync', ()=>{
        it('dispatches setCategory and logs success', async ()=>{
            const categories: Category[] = [{ id: 1, ...baseCategory }];
            (api.fetchCategories as jest.Mock).mockResolvedValue(categories);
            console.log = jest.fn();

            await fetchCategoryAsync()(dispatch);

            expect(api.fetchCategories).toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledWith(setCategories(categories));
            expect(console.log).toHaveBeenCalledWith(
                '✅ Category loaded into Redux'
              );              
        });
    });
    it('logs error on failure without dispatch', async ()=>{
        const error = new Error('fail-fetch');
        (api.fetchCategories as jest.Mock).mockRejectedValue(error);
        console.error = jest.fn();

        await fetchCategoryAsync()(dispatch);

        expect(console.error).toHaveBeenCalledWith(
            '❌ Error loading category:',
            error
        );
        expect(dispatch).not.toHaveBeenCalled();
    });
});