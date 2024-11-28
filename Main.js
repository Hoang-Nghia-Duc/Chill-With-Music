const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const player = $(".player");
        const cd = $('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const playBtn = $('.btn-toggle-play')
        const progress = $('#progress')
        const prevBtn = $(".btn-prev");
        const nextBtn = $(".btn-next");
        const randomBtn = $(".btn-random");
        const repeatBtn = $(".btn-repeat");
        const playlist = $(".playlist");


        const app = {
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,


            songs: [
                {
                    name: "Đừng làm trái tim anh đau",
                    singer: "Sơn Tùng MTP",
                    path: "./assets/music/y2mate.com - Đừng Làm Trái Tim Anh Đau  Sơn Tùng MTP  Lyrics Video .mp3",
                    image: "./assets/img/DungLamTraiTimAnhDau.jfif"
                },
                {
                    name: "Chúng ta của hiện tại",
                    singer: "Sơn Tùng MTP",
                    path: "./assets/music/ChungTaCuaHienTai-SonTungMTP-6892340.mp3",
                    image: "./assets/img/ChungTaCuaHienTai.jpg"
                },
                {
                    name: "Chúng ta của tương lai",
                    singer: "Sơn Tùng MTP",
                    path: "./assets/music/ChungTaCuaTuongLai-SonTungMTP-14032595.mp3",
                    image: "./assets/img/ChúngTaCuaHienTai.jfif"
                },
                {
                    name: "Nơi này có anh",
                    singer: "Sơn Tùng MTP",
                    path: "./assets/music/NoiNayCoAnh-SonTungMTP-4772041.mp3",
                    image: "./assets/img/NoiNayCoAnh.jfif"
                },
                {
                    name: "Mơ",
                    singer: "Vũ Cát Tường",
                    path: "./assets/music/y2mate.com - Mơ  Lyrics Video   Vũ Cát Tường.mp3",
                    image: "./assets/img/Mo.jpg"
                },
                {
                    name: "Chờ đợi có đáng sợ",
                    singer: "ANDIEZ",
                    path: "./assets/music/y2mate.com - CHỜ ĐỢI CÓ ĐÁNG SỢ  ANDIEZ.mp3",
                    image: "./assets/img/ChoDoi.jfif"
                }
            ],
            render: function () {
                const htmls = this.songs.map((song, index) => {
                    return `
                        <div data-index="${index}" class="song ">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
                });
                $('.playlist').innerHTML = htmls.join('\n')
                this.updateActiveSong();

            },
            defineProperties: function () {
                Object.defineProperty(this, 'currentSong', {
                    get: function () {
                        return this.songs[this.currentIndex]
                    }
                })
            },
            handleEvents: function () {

                const _this = this

                // CD quay/ dừng
                const cdThumbAnimate = cdThumb.animate([
                    {
                        transform: 'rotate(360deg)'
                    }
                ], {
                    duration: 10000, //10 giây
                    iterations: Infinity
                })
                cdThumbAnimate.pause()
                // sự kiện thu / phóng
                const cdWidth = cd.offsetWidth
                document.onscroll = function () {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop
                    const newWidth = cdWidth - scrollTop

                    cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
                    cd.style.opacity = newWidth / cdWidth
                }

                // sự kiện play
                playBtn.onclick = function () {
                    if (_this.isPlaying) {
                        audio.pause()

                    }
                    else {
                        audio.play()
                    }

                }

                audio.onplay = function () {
                    _this.isPlaying = true;
                    player.classList.add('playing')
                    cdThumbAnimate.play()

                }
                audio.onpause = function () {
                    _this.isPlaying = false;
                    player.classList.remove('playing')
                    cdThumbAnimate.pause()


                }

                // tiến độ bài hát thay đổi
                audio.ontimeupdate = function () {
                    if (audio.duration) {
                        const progressPercent = (audio.currentTime / audio.duration * 100)
                        progress.value = progressPercent
                    }
                }
                //xử lý tua nhạc
                progress.oninput = function (e) {
                    audio.currentTime = audio.duration * e.target.value / 100
                }

                // xử lý khi next bài
                nextBtn.onclick = function () {
                    if (_this.isRandom) {
                        _this.playRandomSong();
                    }
                    else {

                        _this.nextSong()
                    }
                    audio.play()
                    _this.updateActiveSong()
                    _this.scrollToActiveSong()

                }

                // xử lý khi prev bài
                prevBtn.onclick = function () {
                    if (_this.isRandom) {
                        _this.playRandomSong()
                    }
                    else {
                        _this.prevSong()
                    }
                    audio.play()
                    _this.updateActiveSong()
                    _this.scrollToActiveSong()

                }

                // xử lý khi chọn random bài
                randomBtn.onclick = function (e) {
                    if (_this.isRepeat) {
                        repeatBtn.click()
                    }
                    _this.isRandom = !_this.isRandom;

                    randomBtn.classList.toggle("active", _this.isRandom);


                }

                // xử lý  khi hết nhạc
                audio.onended = function () {
                    if (_this.isRepeat) {
                        audio.play()

                    }
                    else {
                        nextBtn.click()
                    }
                }

                // xử lý khi lặp lại bài hát
                repeatBtn.onclick = function (e) {
                    if (_this.isRandom) {
                        randomBtn.click()
                    }
                    _this.isRepeat = !_this.isRepeat;

                    repeatBtn.classList.toggle("active", _this.isRepeat);

                    
                    

                }
                // xử lý khi click nhạc
                playlist.onclick=function(e){
                    const songNode=e.target.closest('.song:not(.active)')
                    // tìm thẻ click có class song không nếu không thì tìm cha
                        if(songNode || e.target.closest('.option')){
                            if(songNode && !e.target.closest('.option')){
                                _this.currentIndex=songNode.dataset.index
                                _this.loadCurrentSong()
                                audio.play()
                                _this.updateActiveSong()
                            }
                            if(e.target.closest('.option')){

                            }
                        }
                    }
            },
            scrollToActiveSong: function () {
                setTimeout(() => {
                    $(".song.active").scrollIntoView({
                        behavior: "smooth",
                        block: "end"
                    });
                }, 300);
            },
            loadCurrentSong: function () {


                heading.textContent = this.currentSong.name
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
                audio.src = this.currentSong.path

            },

            nextSong: function () {
                this.currentIndex++
                if (this.currentIndex >= this.songs.length) {
                    this.currentIndex = 0
                }
                this.loadCurrentSong()
            },
            prevSong: function () {
                this.currentIndex--
                if (this.currentIndex < 0) {
                    this.currentIndex = this.songs.length - 1
                }
                this.loadCurrentSong()
            },
            playRandomSong: function () {
                let newIndex
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length)
                } while (this.currentIndex === newIndex)
                this.currentIndex = newIndex
                this.loadCurrentSong()

            },
            playRepeatSong: function () {
                let newIndex
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length)
                } while (this.currentIndex === newIndex)
                this.currentIndex = newIndex
                this.loadCurrentSong()
            },
            updateActiveSong: function () {
                const songs = $$(".song")
                // Loại bỏ class "active" khỏi tất cả các bài hát
                songs.forEach(song => song.classList.remove('active'));

                // Thêm class "active" cho bài hát hiện tại dựa trên currentIndex
                songs[this.currentIndex].classList.add('active');



            },
            start: function () {
                //định nghĩa thuộc tính cho Object
                this.defineProperties()
                // Lăng nghe sự kiện 
                this.handleEvents()
                // tải nhạc
                this.loadCurrentSong()
                // render Nhạc
                this.render()


            }

        }
        app.start()