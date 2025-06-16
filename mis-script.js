// 學期按鈕和內容管理 - 資訊管理系版本
document.addEventListener('DOMContentLoaded', function() {
    const semesterButtons = document.querySelectorAll('.semester-btn');
    const semesterContents = document.querySelectorAll('.semester-content');
    
    // 學期配色方案 - 資管系專用配色
    const semesterThemes = {
        1: { primary: '#4f46e5', secondary: '#06b6d4' },
        2: { primary: '#059669', secondary: '#10b981' },
        3: { primary: '#dc2626', secondary: '#f59e0b' },
        4: { primary: '#7c3aed', secondary: '#ec4899' }
    };
    
    // 學期學分數據 (資訊管理系)
    const semesterCredits = {
        1: 15,
        2: 15,
        3: 14,
        4: 14
    };
    
    // 課程統計數據
    const semesterStats = {
        1: { required: 5, elective: 0, totalCourses: 5 },
        2: { required: 5, elective: 0, totalCourses: 5 },
        3: { required: 4, elective: 1, totalCourses: 5 },
        4: { required: 2, elective: 3, totalCourses: 5 }
    };
    
    // 初始化頁面
    function initializePage() {
        // 設置總學分
        document.getElementById('totalCredits').textContent = 
            Object.values(semesterCredits).reduce((sum, credits) => sum + credits, 0);
        
        // 設置第一學期為默認活躍狀態
        switchSemester(1);
        
        // 為每個按鈕添加事件監聽器
        addEventListeners();
        
        // 為每個按鈕添加鍵盤快捷鍵
        addKeyboardShortcuts();
        
        // 添加觸控手勢支援
        addTouchGestureSupport();
        
        // 添加課程卡片互動效果
        addCourseCardInteractions();
        
        // 添加統計資訊
        addSemesterStatistics();
    }
    
    // 添加事件監聽器
    function addEventListeners() {
        semesterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const semesterNumber = parseInt(this.dataset.semester);
                switchSemester(semesterNumber);
            });
        });
    }
    
    // 切換學期
    function switchSemester(semesterNumber) {
        // 更新按鈕狀態
        semesterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.semester) === semesterNumber) {
                btn.classList.add('active');
            }
        });
        
        // 更新內容顯示
        semesterContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `semester-${semesterNumber}`) {
                content.classList.add('active');
            }
        });
        
        // 更新背景主題
        updateBackgroundTheme(semesterNumber);
        
        // 更新動態顏色
        updateDynamicColors(semesterNumber);
        
        // 播放切換音效（如果需要）
        playTransitionSound();
        
        // 更新統計資訊
        updateSemesterStatistics(semesterNumber);
    }
    
    // 更新背景主題
    function updateBackgroundTheme(semesterNumber) {
        document.body.className = `semester-${semesterNumber}`;
    }
    
    // 更新動態顏色
    function updateDynamicColors(semesterNumber) {
        const theme = semesterThemes[semesterNumber];
        const root = document.documentElement;
        
        // 更新CSS變數
        root.style.setProperty('--current-primary', theme.primary);
        root.style.setProperty('--current-secondary', theme.secondary);
        
        // 更新活躍按鈕的顏色
        const activeBtn = document.querySelector(`.semester-btn[data-semester="${semesterNumber}"]`);
        if (activeBtn) {
            activeBtn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
        }
        
        // 更新當前學期的進度條顏色
        const progressFill = document.querySelector(`#semester-${semesterNumber} .progress-fill`);
        if (progressFill) {
            progressFill.style.background = `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`;
        }
        
        // 更新當前學期的學分徽章顏色
        const creditsBadges = document.querySelectorAll(`#semester-${semesterNumber} .credits-badge:not(.elective-badge)`);
        creditsBadges.forEach(badge => {
            badge.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
        });
        
        // 更新當前學期的圖標顏色（非選修課程）
        const courseCards = document.querySelectorAll(`#semester-${semesterNumber} .course-card:not(.elective)`);
        courseCards.forEach(card => {
            const icon = card.querySelector('.course-experience i');
            if (icon) {
                icon.style.color = theme.primary;
            }
        });
        
        // 更新當前學期卡片的頂部邊框
        courseCards.forEach(card => {
            card.style.borderTopColor = theme.primary;
        });
    }
    
    // 播放切換音效
    function playTransitionSound() {
        // 創建音效（可選）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (e) {
            // 如果音效不支援，靜默處理
        }
    }
    
    // 添加鍵盤快捷鍵支援
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // 數字鍵 1-4 切換學期
            if (e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                switchSemester(parseInt(e.key));
            }
            
            // 左右箭頭鍵切換學期
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentSemester = parseInt(document.querySelector('.semester-btn.active').dataset.semester);
                let nextSemester;
                
                if (e.key === 'ArrowLeft') {
                    nextSemester = currentSemester > 1 ? currentSemester - 1 : 4;
                } else {
                    nextSemester = currentSemester < 4 ? currentSemester + 1 : 1;
                }
                
                switchSemester(nextSemester);
            }
        });
    }
    
    // 添加觸控手勢支援
    function addTouchGestureSupport() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // 檢查是否為水平滑動
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const currentSemester = parseInt(document.querySelector('.semester-btn.active').dataset.semester);
                let nextSemester;
                
                if (diffX > 0) {
                    // 向左滑動 - 下一學期
                    nextSemester = currentSemester < 4 ? currentSemester + 1 : 1;
                } else {
                    // 向右滑動 - 上一學期
                    nextSemester = currentSemester > 1 ? currentSemester - 1 : 4;
                }
                
                switchSemester(nextSemester);
            }
            
            // 重置觸控點
            startX = 0;
            startY = 0;
        });
    }
    
    // 添加課程卡片互動效果
    function addCourseCardInteractions() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            // 滑鼠懸停效果
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            });
            
            // 點擊效果
            card.addEventListener('click', function() {
                this.style.transform = 'translateY(-5px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                }, 150);
            });
        });
    }
    
    // 添加學期統計資訊
    function addSemesterStatistics() {
        semesterContents.forEach((content, index) => {
            const semesterNumber = index + 1;
            const stats = semesterStats[semesterNumber];
            const header = content.querySelector('.semester-header');
            
            // 創建統計資訊元素
            const statsDiv = document.createElement('div');
            statsDiv.className = 'semester-stats';
            statsDiv.innerHTML = `
                <div class="stats-item">
                    <span class="stats-label">必修課程</span>
                    <span class="stats-value">${stats.required}</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">選修課程</span>
                    <span class="stats-value">${stats.elective}</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">總課程數</span>
                    <span class="stats-value">${stats.totalCourses}</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">學分</span>
                    <span class="stats-value">${semesterCredits[semesterNumber]}</span>
                </div>
            `;
            
            // 插入統計資訊
            header.appendChild(statsDiv);
        });
        
        // 添加統計資訊的CSS樣式
        const style = document.createElement('style');
        style.textContent = `
            .semester-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .stats-item {
                text-align: center;
                padding: 10px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .stats-label {
                display: block;
                font-size: 0.8rem;
                color: var(--text-secondary);
                margin-bottom: 4px;
            }
            
            .stats-value {
                display: block;
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--text-primary);
            }
            
            @media (max-width: 768px) {
                .semester-stats {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 更新學期統計資訊
    function updateSemesterStatistics(semesterNumber) {
        const currentStats = document.querySelectorAll(`#semester-${semesterNumber} .stats-value`);
        const theme = semesterThemes[semesterNumber];
        
        currentStats.forEach(stat => {
            stat.style.color = theme.primary;
        });
    }
    
    // 處理錯誤
    function handleErrors() {
        window.addEventListener('error', function(e) {
            console.warn('資管系修業計劃系統錯誤:', e.error);
        });
    }
    
    // 添加載入動畫
    function addLoadingAnimation() {
        const cards = document.querySelectorAll('.course-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // 添加平滑滾動
    function addSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // 添加選修課程特殊效果
    function addElectiveEffects() {
        const electiveCards = document.querySelectorAll('.course-card.elective');
        
        electiveCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 25px 50px -12px rgba(124, 58, 237, 0.3)';
            });
        });
    }
    
    // 初始化所有功能
    initializePage();
    addLoadingAnimation();
    addSmoothScrolling();
    addElectiveEffects();
    handleErrors();
    
    // 導出函數供外部使用
    window.MISStudyPlan = {
        switchSemester,
        semesterCredits,
        semesterStats
    };
}); 