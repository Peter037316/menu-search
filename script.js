/*
 * ============================================================
 * 菜单搜索器 - 逻辑与菜单数据
 * ============================================================
 *
 * 技术要点对照表:
 *   菜单数据    √ 按八大菜系 + 家常菜组织的 JSON
 *   模糊搜索    √ 菜名/食材/分类多字段匹配 + 高亮
 *   实时筛选    √ 分类 + 排序 + 搜索联动
 *   难度排序    √ easy/medium/hard 映射为数值排序
 *   搜索高亮    √ 正则替换 <mark> 标签 + CSS 渲染
 *   弹窗交互    √ 详情模态框 + 关闭逻辑
 * ============================================================
 */

// ==================== 菜单数据库 ====================
const MENU_DATA = [
    // ===== 川菜 =====
    { id: 1, name: "麻婆豆腐", emoji: "🌶️", category: "川菜", difficulty: "medium", time: 25, ingredients: "豆腐、牛肉末、豆瓣酱、花椒", steps: ["豆腐切块焯水", "牛肉末炒香", "加豆瓣酱炒出红油", "加豆腐和水炖煮", "勾芡撒花椒粉"] },
    { id: 2, name: "宫保鸡丁", emoji: "🍗", category: "川菜", difficulty: "medium", time: 20, ingredients: "鸡胸肉、花生、干辣椒、花椒", steps: ["鸡肉切丁腌制", "干辣椒切段", "花生炸香备用", "炒鸡丁加干辣椒花椒", "加入花生翻炒出锅"] },
    { id: 3, name: "鱼香肉丝", emoji: "🥕", category: "川菜", difficulty: "medium", time: 25, ingredients: "猪肉、木耳、胡萝卜、泡椒", steps: ["肉丝腌制", "调鱼香汁", "炒肉丝盛出", "炒配菜", "倒回肉丝加汁翻炒"] },
    { id: 4, name: "水煮鱼", emoji: "🐟", category: "川菜", difficulty: "hard", time: 40, ingredients: "草鱼、豆芽、干辣椒、花椒", steps: ["鱼片腌制", "豆芽焯水铺底", "鱼片煮熟", "淋热油", "撒干辣椒花椒"] },
    { id: 5, name: "回锅肉", emoji: "🥓", category: "川菜", difficulty: "easy", time: 30, ingredients: "五花肉、青蒜、豆瓣酱、豆豉", steps: ["五花肉煮熟切片", "炒肉片出油", "加豆瓣酱豆豉", "加青蒜翻炒"] },

    // ===== 粤菜 =====
    { id: 6, name: "白切鸡", emoji: "🐔", category: "粤菜", difficulty: "medium", time: 45, ingredients: "三黄鸡、姜、葱、盐", steps: ["鸡洗净焯水", "加姜葱煮20分钟", "浸冰水保持皮爽", "切件装盘", "配蘸料食用"] },
    { id: 7, name: "清蒸鲈鱼", emoji: "🐟", category: "粤菜", difficulty: "easy", time: 20, ingredients: "鲈鱼、姜、葱、蒸鱼豉油", steps: ["鱼处理干净", "铺姜丝葱花", "水开蒸8分钟", "淋蒸鱼豉油", "淋热油"] },
    { id: 8, name: "煲仔饭", emoji: "🍚", category: "粤菜", difficulty: "medium", time: 35, ingredients: "腊肉、腊肠、米饭、青菜", steps: ["砂锅刷油放米", "加水煮饭", "快熟时放腊味", "打入鸡蛋", "淋酱油撒葱花"] },
    { id: 9, name: "叉烧", emoji: "🍖", category: "粤菜", difficulty: "hard", time: 60, ingredients: "猪里脊、叉烧酱、蜂蜜、姜", steps: ["肉腌制2小时", "烤箱200度烤20分钟", "刷蜂蜜再烤10分钟", "切片装盘"] },

    // ===== 鲁菜 =====
    { id: 10, name: "糖醋鲤鱼", emoji: "🐟", category: "鲁菜", difficulty: "hard", time: 40, ingredients: "鲤鱼、面粉、糖、醋", steps: ["鱼剞刀腌制", "挂糊炸定型", "复炸至金黄", "调糖醋汁", "淋汁浇鱼"] },
    { id: 11, name: "葱烧海参", emoji: "🦪", category: "鲁菜", difficulty: "hard", time: 50, ingredients: "海参、大葱、高汤、酱油", steps: ["海参泡发", "大葱切段", "炒葱段出香味", "加海参烧煮", "勾芡出锅"] },
    { id: 12, name: "九转大肠", emoji: "🍖", category: "鲁菜", difficulty: "hard", time: 60, ingredients: "猪大肠、白糖、醋、酱油", steps: ["大肠清洗煮熟", "切段炸定型", "调汁烧煮", "挂糖色", "反复烧至入味"] },

    // ===== 苏菜 =====
    { id: 13, name: "松鼠桂鱼", emoji: "🐿️", category: "苏菜", difficulty: "hard", time: 50, ingredients: "桂鱼、松子、青豆、番茄酱", steps: ["鱼去骨剞花", "挂糊炸松鼠形", "炸松子青豆", "调番茄汁", "淋汁撒松子"] },
    { id: 14, name: "狮子头", emoji: "🦁", category: "苏菜", difficulty: "medium", time: 45, ingredients: "猪肉、荸荠、青菜、高汤", steps: ["猪肉荸荠斩碎", "加调料搅上劲", "团成丸子", "炖2小时", "加青菜煮熟"] },
    { id: 15, name: "盐水鸭", emoji: "🦆", category: "苏菜", difficulty: "medium", time: 50, ingredients: "鸭子、盐、花椒、八角", steps: ["鸭子腌制4小时", "煮30分钟", "浸凉后切片", "配椒盐食用"] },

    // ===== 浙菜 =====
    { id: 16, name: "西湖醋鱼", emoji: "🐟", category: "浙菜", difficulty: "medium", time: 30, ingredients: "草鱼、糖、醋、姜", steps: ["草鱼处理干净", "煮熟捞出", "调糖醋汁", "淋汁浇鱼", "撒姜末"] },
    { id: 17, name: "东坡肉", emoji: "🍖", category: "浙菜", difficulty: "medium", time: 90, ingredients: "五花肉、白糖、黄酒、姜", steps: ["五花肉焯水", "切方块", "加调料慢炖1小时", "装盘蒸10分钟", "淋汁上桌"] },
    { id: 18, name: "龙井虾仁", emoji: "🦐", category: "浙菜", difficulty: "easy", time: 15, ingredients: "虾仁、龙井茶、淀粉、盐", steps: ["虾仁上浆", "茶叶泡开", "滑炒虾仁", "加茶叶翻炒", "调味出锅"] },

    // ===== 闽菜 =====
    { id: 19, name: "佛跳墙", emoji: "🏺", category: "闽菜", difficulty: "hard", time: 120, ingredients: "鲍鱼、海参、鱼翅、花胶", steps: ["所有食材泡发", "焯水去腥", "层层装坛", "加高汤密封", "慢炖3小时"] },
    { id: 20, name: "荔枝肉", emoji: "🍖", category: "闽菜", difficulty: "medium", time: 25, ingredients: "猪肉、荸荠、番茄酱、糖", steps: ["猪肉切块腌制", "挂糊炸定型", "调糖醋汁", "加荸荠翻炒", "淋汁出锅"] },
    { id: 21, name: "海蛎煎", emoji: "🥚", category: "闽菜", difficulty: "easy", time: 15, ingredients: "海蛎、鸡蛋、淀粉、葱", steps: ["海蛎洗净", "加鸡蛋淀粉搅拌", "平底锅煎制", "两面金黄", "配甜辣酱"] },

    // ===== 湘菜 =====
    { id: 22, name: "剁椒鱼头", emoji: "🐟", category: "湘菜", difficulty: "medium", time: 30, ingredients: "鳙鱼头、剁椒、姜、葱", steps: ["鱼头劈开腌制", "铺剁椒", "水开蒸15分钟", "淋热油", "撒葱花"] },
    { id: 23, name: "小炒黄牛肉", emoji: "🥩", category: "湘菜", difficulty: "easy", time: 15, ingredients: "黄牛肉、泡椒、小米椒、香菜", steps: ["牛肉切片腌制", "泡椒小米椒切碎", "大火快炒牛肉", "加辣椒翻炒", "撒香菜出锅"] },
    { id: 24, name: "口味虾", emoji: "🦐", category: "湘菜", difficulty: "medium", time: 35, ingredients: "小龙虾、紫苏、蒜、辣椒", steps: ["小龙虾清洗", "剪去虾头", "油炸变红", "加调料翻炒", "收汁出锅"] },

    // ===== 徽菜 =====
    { id: 25, name: "臭鳜鱼", emoji: "🐟", category: "徽菜", difficulty: "medium", time: 40, ingredients: "鳜鱼、豆豉、姜、蒜", steps: ["鳜鱼腌制7天", "洗净晾干", "油炸两面金黄", "加调料烧煮", "收汁撒葱"] },
    { id: 26, name: "毛豆腐", emoji: "🧀", category: "徽菜", difficulty: "easy", time: 10, ingredients: "毛豆腐、辣酱、蒜末、葱", steps: ["豆腐切块长霉", "平底锅煎制", "刷辣酱", "撒蒜末", "出锅装盘"] },
    { id: 27, name: "一品锅", emoji: "🍲", category: "徽菜", difficulty: "hard", time: 60, ingredients: "肉圆、蛋饺、豆腐、笋干", steps: ["蛋饺肉圆准备", "层层码入砂锅", "加高汤炖煮", "小火煨30分钟", "加青菜出锅"] },

    // ===== 家常菜 =====
    { id: 28, name: "番茄炒蛋", emoji: "🍅", category: "家常菜", difficulty: "easy", time: 10, ingredients: "番茄、鸡蛋、糖、盐", steps: ["鸡蛋打散", "番茄切块", "炒蛋盛出", "炒番茄出汁", "倒回鸡蛋翻炒"] },
    { id: 29, name: "青椒土豆丝", emoji: "🥔", category: "家常菜", difficulty: "easy", time: 12, ingredients: "土豆、青椒、醋、盐", steps: ["土豆切丝泡水", "青椒切丝", "土豆丝焯水", "大火快炒", "淋醋出锅"] },
    { id: 30, name: "红烧肉", emoji: "🍖", category: "家常菜", difficulty: "medium", time: 60, ingredients: "五花肉、白糖、酱油、八角", steps: ["五花肉焯水切块", "炒糖色", "加肉块翻炒", "加调料加水", "小火炖40分钟收汁"] },
    { id: 31, name: "西红柿鸡蛋汤", emoji: "🍲", category: "家常菜", difficulty: "easy", time: 10, ingredients: "番茄、鸡蛋、淀粉、盐", steps: ["番茄切块", "加水煮开", "勾薄芡", "淋入蛋液", "调味出锅"] },
    { id: 32, name: "醋溜白菜", emoji: "🥬", category: "家常菜", difficulty: "easy", time: 8, ingredients: "白菜、醋、蒜、干辣椒", steps: ["白菜切段", "蒜和辣椒切碎", "大火快炒", "淋醋调味", "出锅装盘"] },
    { id: 33, name: "地三鲜", emoji: "🍆", category: "家常菜", difficulty: "medium", time: 20, ingredients: "茄子、土豆、青椒、蒜", steps: ["茄子土豆切块", "分别过油", "留底油炒蒜", "加三蔬翻炒", "淋汁出锅"] },
    { id: 34, name: "土豆烧牛肉", emoji: "🥩", category: "家常菜", difficulty: "hard", time: 90, ingredients: "牛肉、土豆、胡萝卜、洋葱", steps: ["牛肉焯水", "切块煸炒", "加调料炖60分钟", "加土豆胡萝卜", "再炖20分钟收汁"] },
    { id: 35, name: "可乐鸡翅", emoji: "🍗", category: "家常菜", difficulty: "easy", time: 30, ingredients: "鸡翅、可乐、酱油、姜", steps: ["鸡翅焯水", "划几刀腌制", "煎两面金黄", "倒可乐加酱油", "收汁出锅"] },
];

// ==================== 难度映射 ====================
const DIFFICULTY_MAP = { easy: { label: "简单", order: 1 }, medium: { label: "中等", order: 2 }, hard: { label: "困难", order: 3 } };

// ==================== DOM 元素 ====================
const $ = (id) => document.getElementById(id);

const searchInput = $("searchInput");
const clearBtn = $("clearBtn");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortBtns = document.querySelectorAll(".sort-btn");
const dishGrid = $("dishGrid");
const noResults = $("noResults");
const resetBtn = $("resetBtn");
const totalCount = $("totalCount");
const resultCount = $("resultCount");

const dishModal = $("dishModal");
const closeModal = $("closeModal");
const modalName = $("modalName");
const modalEmoji = $("modalEmoji");
const modalCategory = $("modalCategory");
const modalDifficulty = $("modalDifficulty");
const modalTime = $("modalTime");
const modalIngredients = $("modalIngredients");
const modalSteps = $("modalSteps");

// ==================== 状态 ====================
let state = {
    keyword: "",
    category: "all",
    sort: "default",
};

// ==================== 初始化 ====================
totalCount.textContent = MENU_DATA.length;
render();

// ==================== 事件绑定 ====================

// 搜索输入
searchInput.addEventListener("input", (e) => {
    state.keyword = e.target.value.trim().toLowerCase();
    clearBtn.classList.toggle("hidden", !state.keyword);
    render();
});

// 清空搜索
clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    state.keyword = "";
    clearBtn.classList.add("hidden");
    render();
});

// 分类筛选
filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.category = btn.dataset.category;
        render();
    });
});

// 排序
sortBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        sortBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.sort = btn.dataset.sort;
        render();
    });
});

// 重置
resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.classList.add("hidden");
    state.keyword = "";
    state.category = "all";
    state.sort = "default";
    filterBtns.forEach((b) => b.classList.remove("active"));
    document.querySelector('.filter-btn[data-category="all"]').classList.add("active");
    sortBtns.forEach((b) => b.classList.remove("active"));
    document.querySelector('.sort-btn[data-sort="default"]').classList.add("active");
    render();
});

// 详情弹窗关闭
closeModal.addEventListener("click", () => dishModal.classList.remove("show"));
dishModal.addEventListener("click", (e) => {
    if (e.target === dishModal) dishModal.classList.remove("show");
});

// ==================== 核心渲染逻辑 ====================

/* 搜索 + 筛选 + 排序 */
function getFilteredDishes() {
    let dishes = MENU_DATA;

    // 分类筛选
    if (state.category !== "all") {
        dishes = dishes.filter((d) => d.category === state.category);
    }

    // 关键词搜索(菜名/食材/分类)
    if (state.keyword) {
        const kw = state.keyword;
        dishes = dishes.filter((d) =>
            d.name.toLowerCase().includes(kw) ||
            d.ingredients.toLowerCase().includes(kw) ||
            d.category.toLowerCase().includes(kw)
        );
    }

    // 排序
    if (state.sort === "name") {
        dishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name, "zh"));
    } else if (state.sort === "time") {
        dishes = [...dishes].sort((a, b) => a.time - b.time);
    } else if (state.sort === "difficulty") {
        dishes = [...dishes].sort((a, b) => DIFFICULTY_MAP[a.difficulty].order - DIFFICULTY_MAP[b.difficulty].order);
    }

    return dishes;
}

/* 渲染卡片网格 */
function render() {
    const dishes = getFilteredDishes();
    resultCount.textContent = dishes.length;

    dishGrid.innerHTML = "";

    if (dishes.length === 0) {
        noResults.classList.add("show");
        return;
    }

    noResults.classList.remove("show");

    dishes.forEach((dish, index) => {
        const card = document.createElement("div");
        card.className = "dish-card";
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <span class="dish-card-emoji">${dish.emoji}</span>
            <h3>${highlight(dish.name, state.keyword)}</h3>
            <div class="dish-card-tags">
                <span class="tag category">${highlight(dish.category, state.keyword)}</span>
                <span class="tag difficulty-${dish.difficulty}">${DIFFICULTY_MAP[dish.difficulty].label}</span>
            </div>
            <div class="dish-card-meta">
                <span>⏱️ ${dish.time} 分钟</span>
                <span>🍽️ ${highlight(dish.ingredients.split("、")[0], state.keyword)}...</span>
            </div>
        `;
        card.addEventListener("click", () => showDetail(dish));
        dishGrid.appendChild(card);
    });
}

/* 搜索高亮 */
function highlight(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${escapeRegex(keyword)})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* 显示详情 */
function showDetail(dish) {
    modalName.textContent = dish.name;
    modalEmoji.textContent = dish.emoji;
    modalCategory.textContent = dish.category;
    modalDifficulty.textContent = DIFFICULTY_MAP[dish.difficulty].label;
    modalDifficulty.className = `difficulty-tag ${dish.difficulty}`;
    modalTime.textContent = `${dish.time} 分钟`;
    modalIngredients.textContent = dish.ingredients;

    modalSteps.innerHTML = dish.steps.map((s) => `<li>${s}</li>`).join("");

    dishModal.classList.add("show");
}
