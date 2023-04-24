const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'AQ_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');

const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');

const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');

const randomBtn = $('.btn-random');

const repeatBtn = $('.btn-repeat');

const playlist = $('.playlist');

    

    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

        songs: [
            {
            name: 'Không Thể Say',
            singer: 'HIEUTHUHAI',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
            },
            {
            name: 'Để tôi ôm em bằng giai điệu này',
            singer: 'Kai Dinh, MIN, GREY D',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
            },
            {
            name: 'Nếu Lúc Đó',
            singer: 'tlinh, 2pillz',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
            },
            {
            name: 'Waiting For You',
            singer: 'Mono',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
            },
            {
            name: 'Lan Man',
            singer: 'Ronboogz',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
            },
            {
            name: 'Ngủ Một Mình (tình Rất Tình)',
            singer: 'HIEUTHUHAI, Negav, Kewtiie',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
            },
            {
            name: 'Ai Mới Là Kẻ Xấu Xa',
            singer: 'MCK',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
            },
            {
            name: 'Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau',
            singer: 'O.lew',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
            },
            {
            name: 'Chuyện Chúng Ta Sau Này',
            singer: 'Hải Đăng Doo, ERIK',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
            },
            {
                name: 'Dự Báo Thời Tiết Hôm Nay Mưa',
                singer: 'GREY D, PHÚC DU',
                path: './assets/music/song10.mp3',
                image: './assets/img/song10.jpg'
            },
        ],

        setConfig: function(key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
        },

        render: function() {
            console.log(123);
            const htmls = this.songs.map((song,index) => {
                return `
                <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
            })
            playlist.innerHTML = htmls.join('');
        },
        
        defineProperties: function () {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            })
        },

        handleEvents: function() {
            const cdWidth = cd.offsetWidth;

            //Xu ly CD quay va dung
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ], {
                duration: 10000, //10s
                iterations: Infinity
            })
            cdThumbAnimate.pause();


            //Xu ly phong to thu nho CD
            document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop;

                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
                cd.style.opacity = newCdWidth / cdWidth;
            }

            //Xu ly khi play
            playBtn.onclick = function(){
                if (app.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
                
            }

            //Khi bai hat duoc play
            audio.onplay = function() {
                app.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }

            //Khi bai hat duoc pause
            audio.onpause = function() {
                app.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }

            //Khi tien do bai hat thay doi
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }

            //Khi tua bai hat 
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }

            //Khi next bai hat
            nextBtn.onclick = function(){
                if (app.isRandom) {
                    app.playRandomSong();
                } else {
                    app.nextSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            }

            //Khi prev bai hat
            prevBtn.onclick = function(){
                if (app.isRandom) {
                    app.playRandomSong();
                } else {
                    app.prevSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            }

            //Khi bat che do random bai hat
            randomBtn.onclick = function(e){
                app.isRandom = !app.isRandom;
                app.setConfig('isRandom', app.isRandom);
                randomBtn.classList.toggle('active', app.isRandom);
            }

            //Xu ly next song khi audio ended
            audio.onended = function() {
                if (app.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            }


            //Xu ly lap lai 1 song
            repeatBtn.onclick = function(e) {
                app.isRepeat = !app.isRepeat;
                app.setConfig('isRepeat', app.isRepeat);
                repeatBtn.classList.toggle('active', app.isRepeat);
                
            }

            // Lang nghe hanh vi click vao playlist
            playlist.onclick = function(e) {
                //xu ly khi click vao song
                const songNode = e.target.closest('.song:not(.active)');
                if (songNode || e.target.closest('.option')) {

                    if (songNode) {
                        app.currentIndex = Number(songNode.dataset.index);
                        app.loadCurrentSong();
                        app.render();
                        audio.play(); 
                    }

                }   
            }
        },

        scrollToActiveSong: function(e) {
            setTimeout(() => {
                $('song.active').scrollIntoView({
                    behavior:'smooth',
                    block: 'nearest',
                })
            }, 300)
        },



        loadCurrentSong: function() {

            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
        },


        loadConfig: function() {
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
        },

        //Khi next bai hat
        nextSong: function(){
            this.currentIndex++;
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },

        //Khi back bai hat
        prevSong: function(){
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong();
        },

        playRandomSong: function() {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentIndex);

            this.currentIndex = newIndex;
            this.loadCurrentSong();
        },

        start: function() {
            //load configuration
            this.loadConfig();

            // Định nghĩa các thuộc tính cho Object 
            this.defineProperties();

            //Lắng nghe và xử lý các event trong DOM
            this.handleEvents();

            //Tair thong tin bai hat dau tien vao UI khi chay ung dung
            this.loadCurrentSong()

            // Render Playlist
            this.render();

            //hien thi trang thai ban dau cua button repeat va random
            repeatBtn.classList.toggle('active', this.isRepeat);
            randomBtn.classList.toggle('active', this.isRandom);
        }
    }

app.start();