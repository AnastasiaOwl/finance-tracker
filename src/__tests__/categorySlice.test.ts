import categoryReducer, {
    addCategory,
    setCategories,
    deleteCategory,
    type Category,
} from "@/redux/categorySlice"

type CategoryState = ReturnType<typeof categoryReducer>;

describe("categorySlice reducer", ()=>{
    const initialState: CategoryState = {categories: []};

    const sampleCtgr: Category [] = [
        {
            id: 1,
            name: "репетиторство",
            type: "Дохід",
        },
        {
            id: 2,
            name: "продукти",
            type: "Витрати",
        }
    ];

    it("should return the initial state when called with unknown action", ()=>{
        const next = categoryReducer(initialState,{ type: "unknown" });
        expect(next).toEqual(initialState);
    })

    it("should handle setCategory", ()=>{
        const next = categoryReducer(initialState, setCategories(sampleCtgr));
        expect(next.categories).toEqual(sampleCtgr);
    })

    it("should handle addCategory", ()=>{
        const stateAfterAdd = categoryReducer(
            initialState,
            addCategory(sampleCtgr[0])
        );
        expect(stateAfterAdd.categories).toHaveLength(1);
        expect(stateAfterAdd.categories[0]).toEqual(sampleCtgr[0]);

        const stateAfterSecond = categoryReducer(
            stateAfterAdd,
            addCategory(sampleCtgr[1])
        );
        expect(stateAfterSecond.categories).toHaveLength(2);
        expect(stateAfterSecond.categories[1]).toEqual(sampleCtgr[1]);
    });

    it("should handle deleteCategory", ()=>{
        const startState: CategoryState = {
            categories: [...sampleCtgr],
        };
        const stateAfterDelete = categoryReducer(
            startState,
            deleteCategory("1")
        );
        expect(stateAfterDelete.categories).toEqual([sampleCtgr[1]]);
    })
})