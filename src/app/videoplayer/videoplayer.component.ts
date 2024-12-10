import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-videoplayer',
  standalone: false,

  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.css'
})
export class VideoplayerComponent {

  videoSrc: string = "../../../video/demovideo.mp4";
  progresstimer: string = "00:00"
  currentTimer: string = "00:00"
  videoDuration: string = "00:00"
  
  fullscreenboll:boolean = false;
  fullscreenCount:number = 0;
  fullClass:string = "";
  
  isplaying: boolean = false;
  playpauseCount: number = 0;
  controlerClass: string = "show";

  valumecount:number = 1

  formatTime(time: number): string {
    const seconds = String(Math.floor(time % 60)).padStart(2, '0');
    const minutes = String(Math.floor(time / 60) % 60).padStart(2, '0');
    const hours = Math.floor(time / 3600) > 0 ? String(Math.floor(time / 3600)).padStart(2, '0') : null;
    return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;    
  }
  
  
  togglePlayPause() {
    this.playpauseCount++
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if(this.playpauseCount % 2 === 0) {
      this.isplaying = false
      videoElement.pause();
      this.controlerClass = "show"
    }else{
      this.isplaying = true
      videoElement.play();
      this.controlerClass = ""
    }
  }


  timelineevent(e: any) {
    var mainVideo:any = document.querySelector('video') as HTMLVideoElement;
    let timelineWidth = document.querySelector(".video_progress_cont")!.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
  }

  timelineeventMousemove(e: any) {
    let timelineWidth =  document.querySelector(".video_progress_cont")!.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * document.querySelector('video')!.duration);
    const progressTime =  document.getElementById("progressTimer")
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime!.style.left = `${offsetX}px`;
    this.progresstimer = this.formatTime(percent)
  }

  fullscreenEvent(){
    this.fullscreenCount ++
    if(this.fullscreenCount % 2 === 0) {
      this.fullscreenboll = false
      this.fullClass = "";
      document.exitFullscreen();
    } else{
      this.fullscreenboll = true
      this.fullClass = "fullscreen";
      document.querySelector(".video_cont")!.requestFullscreen();
    }    
  }
  
  volumeEvent(e:any){
    let mainVideo:any = document.querySelector('video') as HTMLVideoElement
    let volumeX = e.offsetX;
    let convertedVolume = volumeX / 100
    mainVideo.volume = convertedVolume
    if (convertedVolume > 0.5) {
      this.valumecount = 1
    } else if (convertedVolume <= 0.5) {
      this.valumecount = 0.5
    }
    if (convertedVolume <= 0.04){
      this.valumecount = 0
      mainVideo.volume = 0
    }
    document.getElementById("volume")!.style.width = volumeX + "%";
  }


  ngOnInit() {
    document.addEventListener('DOMContentLoaded', () => {

      let mainVideo:any = document.querySelector('video') as HTMLVideoElement
      let progressBar:any = document.getElementById("progress_bar");

      mainVideo.addEventListener("timeupdate", (e:any) => {
        let {
          currentTime,
          duration
        } = e.target;
        let percent = (currentTime / duration) * 100;
        progressBar!.style.width = `${percent}%`;
        this.currentTimer = this.formatTime(currentTime);

        if (mainVideo.currentTime === mainVideo.duration) {
          mainVideo.currentTime = mainVideo.duration
          this.isplaying = false
          this.controlerClass = "show"
          mainVideo.pause();
          progressBar!.style.width = '100%';
        }
      });

      mainVideo.addEventListener("loadeddata", () => {
        this.videoDuration = this.formatTime(mainVideo.duration);
      });
    })

    document.addEventListener("keyup", (e:any) => {
      switch (e.code) {
        case "Escape":
          if (this.fullClass === "fullscreen") {
            this.fullscreenCount = 0
            this.fullscreenboll = false
            this.fullClass = ""
          }
          break;
        default:
          break;
      }
    })
  }

}
interface OnInit {
  ngOnInit(): void;
}
