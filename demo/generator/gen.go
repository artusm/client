package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"time"

	"github.com/pkg/errors"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	baseURL := "http://es:9200/"

	ts := time.Now().UTC()

	docURL := fmt.Sprintf("%s%s-%d.%02d.%02d/_doc/", baseURL, "li",  ts.Year(), ts.Month(), ts.Day())
	err := waitForResponsiveServer(baseURL, time.Now().Add(1 * time.Minute))
	if err != nil {
		panic(err)
	}
	jsonFile, err := ioutil.ReadFile("elastic-template.json")

	if err != nil {
		panic(err)
	}

	err = createElasticTemplate(baseURL, bytes.NewBuffer(jsonFile))

	if err != nil {
		panic(err)
	}

	backfill, ok := os.LookupEnv("BACKFILL")
	if ok && backfill == "1" {
		go backFill(docURL)
	}
	liveFill(docURL)
}

func createElasticTemplate(baseUrl string, data *bytes.Buffer) (error) {
    templateUrl := fmt.Sprintf("%s_template/li-template", baseUrl)
	client := &http.Client{}

    req, err := http.NewRequest(http.MethodPut, templateUrl, data)

    if err != nil {
		return errors.Wrapf(err, "Ошибка при формирования запроса %s", templateUrl)
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	resp, err := client.Do(req)
	if err != nil {
		return errors.Wrapf(err, "Ошибка при получении ответа %s", templateUrl)
	}

	if resp.StatusCode == 200 {
		return nil
	}

    return errors.New("Ошибка.")
}

func waitForResponsiveServer(url string, timeout time.Time) error {
	for time.Now().Before(timeout) {
		log.Printf("Ждем elasticsearch %s", url)
		time.Sleep(time.Second)

		resp, err := http.Get(url)
		if err != nil {
			err = errors.Wrapf(err, "Ошибка при получении ответа %s", url)
			continue
		}

		if resp.StatusCode == 200 {
			return nil
		}
	}

	return errors.New("Ошибка.")
}

func backFillJob(url string, payloads chan *bytes.Buffer) {
	for payload := range payloads {
		resp, err := http.Post(url, "application/json", payload)
		if err != nil {
			log.Printf("Не удалось отправить запрос: %+v", err)
			continue
		}
		_ = resp.Body.Close()
	}
}

func backFill(url string) {
	queue := make(chan *bytes.Buffer)
	for i := 0; i < 8; i++ {
		go backFillJob(url, queue)
	}

	timeMachine := time.Now()
	limit := timeMachine.Add(-time.Hour * 24 * 2)
	nextCheckDelta, duration := newDurations()
	nextCheck := timeMachine.Add(-nextCheckDelta)

	for timeMachine.After(limit) {
		timeMachine = timeMachine.Add(-duration)

		payload, err := genPayload(timeMachine)
		if err != nil {
			log.Printf("Не удалось отправить запрос: %+v", err)
			continue
		}
		queue <- payload

		if timeMachine.Before(nextCheck) {
			nextCheckDelta, duration = newDurations()
			nextCheck = timeMachine.Add(-nextCheckDelta)
		}
	}

	close(queue)
}

func liveFill(url string) {
	nextCheckDuration, duration := newDurations()
	nextCheck := time.Now().Add(nextCheckDuration)

	for {
		time.Sleep(duration)

		payload, err := genPayload(time.Now())
		if err != nil {
			log.Printf("Не удалось отправить запрос: %+v", err)
			continue
		}

		resp, err := http.Post(url, "application/json", payload)
		if err != nil {
			log.Printf("Не удалось отправить запросt: %+v", err)
			continue
		}
		_ = resp.Body.Close()

		if time.Now().After(nextCheck) {
			nextCheckDuration, duration = newDurations()
			nextCheck = time.Now().Add(nextCheckDuration)
		}
	}
}

func newDurations() (nextCheck time.Duration, duration time.Duration) {
	duration = time.Millisecond * time.Duration(50*(rand.Int()%50))
	nextCheck = time.Second * time.Duration(rand.Int()%120)
	log.Printf("Задержка: %s След. проверка: %s", duration, nextCheck)
	return
}

type EslDatabaseStatus struct {
    BattLast int `json:"batt_last"`
    BattMin int `json:"batt_min"`
    BootMode int `json:"boot_mode"`
    BootVersion int `json:"boot_version"`
    DisplayType string `json:"display_type"`
    DrawCount int `json:"draw_count"`
    Driver int `json:"driver"`
    ErrFile int `json:"err_file"`
    ErrLine int `json:"err_line"`
    ErrTimestamp int `json:"err_timestamp"`
    Errcode int `json:"errcode"`
    EslDispCol int `json:"esl_disp_col"`
    EslDispType int `json:"esl_disp_type"`
    EslHeight int `json:"esl_height"`
    EslImageType int `json:"esl_image_type"`
    EslWidth int `json:"esl_width"`
    FwCrc int `json:"fw_crc"`
    Height int `json:"height"`
    HwVersion int `json:"hw_version"`
    ID string `json:"id"`
    Idx string `json:"idx"`
    Online int `json:"online"`
    PicCrc int64 `json:"pic_crc"`
    ProtonVersion int `json:"proton_version"`
    Rssi int `json:"rssi"`
    Size float64 `json:"size"`
    SwVersion int `json:"sw_version"`
    Temp int `json:"temp"`
    Timestamp int `json:"timestamp"`
    TotalTime int `json:"total_time"`
    Type string `json:"type"`
    Uptime int `json:"uptime"`
    Width int `json:"width"`
}

//type EslStatus struct {
//    Appver int `json:"APPVER"`
//    Bootmode int `json:"BOOTMODE"`
//    Bootver int `json:"BOOTVER"`
//    Crc32Fw int `json:"Crc32Fw"`
//    Crc32Img int64 `json:"Crc32Img"`
//    Dispcol int `json:"DispCol"`
//    Disptype int `json:"DispType"`
//    Drawsum int `json:"DrawSum"`
//    Errfileid int `json:"ErrFileID"`
//    Errline int `json:"ErrLine"`
//    Errtime int `json:"ErrTime"`
//    Errcode int `json:"Errcode"`
//    Hwtype int `json:"HWTYPE"`
//    Imagetype int `json:"ImageType"`
//    Protonv int `json:"PROTONV"`
//    Rssi int `json:"Rssi"`
//    Scdimx int `json:"ScDimX"`
//    Scdimy int `json:"ScDimY"`
//    Temp int `json:"Temp"`
//    Totaltime int `json:"TotalTime"`
//    Uptime int `json:"Uptime"`
//    Vlast int `json:"Vlast"`
//    Vmin int `json:"Vmin"`
//}

type Machine struct {
	Hostname string `json:"hostname"`
}

type P struct {
	Timestamp         string `json:"@timestamp"`
	Esl               int     `json:"esl"`
	EslDatabaseStatus EslDatabaseStatus `json:"esl_database_status"`
	//EslStatus EslStatus `json:"esl_status"`
	Level   string `json:"level"`
	LogType string `json:"log_type"`
	Machine Machine `json:"machine"`
	Message string    `json:"message"`
	Offset  int       `json:"offset"`
	ReadAt  string `json:"read_at"`
	Source  string    `json:"source"`
	Type    string    `json:"type"`
}

type PW struct {
	Timestamp         string `json:"@timestamp"`
	Esl               int     `json:"esl"`
	Level   string `json:"level"`
	LogType string `json:"log_type"`
	Machine Machine `json:"machine"`
	Message string    `json:"message"`
	Offset  int       `json:"offset"`
	ReadAt  string `json:"read_at"`
	Source  string    `json:"source"`
}

type PWD struct {
	Timestamp         string `json:"@timestamp"`
	Esl               int     `json:"esl"`
	Level   string `json:"level"`
	LogType string `json:"log_type"`
	Machine Machine `json:"machine"`
	Message string    `json:"message"`
	Offset  int       `json:"offset"`
	ReadAt  string `json:"read_at"`
	Source  string    `json:"source"`
	AnomalyCategory string `json:"anomaly_category"`
}

var esls = [13]int{
	2000004716011,
	2000004716000,
	2000004716012,
	2000004716013,
	2000001440346,
	2000004742782,
	2000004485283,
	2000004307226,
	2000003462704,
	2000004912312,
	2000004408374,
	2000004412441,
	2000004532532,
	//2000004676576,
	//2000004756755,
	//2000004756756,
	//2000004654645,
	//2000004978977,
	//2000004834532,
}

func getRandomEsl() int  {
	randomIndex := rand.Intn(len(esls))

	return esls[randomIndex]
}

var temp = make(map[string] int)

func getTemp(esl int, when time.Time) int {
    key := fmt.Sprintf("%d_%s", esl, when.Format("2006-01-02"))

    if temp[key] == 0  {
		temp[key] = randomNumber(2900, 3150)
	}

    return temp[key]
}

var (
	singleQuoteRegex *regexp.Regexp
)

func init()  {
	singleQuoteRegex, _ = regexp.Compile(`"`)
}

func ReplaceSingleQuotes(json string) string  {
	return singleQuoteRegex.ReplaceAllString(json, `'`)
}

func genEslDatabase(when time.Time) (*bytes.Buffer, error) {
	esl := getRandomEsl()

    eslDatabase := EslDatabaseStatus{
    	ID: strconv.Itoa(esl),
		DisplayType: "bwr",
		Height: 0,
		Width: 0,
		Idx: "",
		Driver: 0,
		Online: 1,
		Type: "A",
		Size: 0.0,
		ProtonVersion: 1,
		HwVersion: 1,
		SwVersion: 705,
		BootVersion: 705,
		BootMode: 0,
		EslDispType: 2,
		EslImageType: 1,
		EslDispCol: 1,
		EslHeight: 152,
		EslWidth: 152,
		DrawCount: randomNumber(0, 200),
		BattLast:     randomNumber(2900, 3150),
		BattMin:      getTemp(esl, when),
		Temp:         randomNumber(21, 24),
		Rssi:         69,
		Uptime:       randomNumber(30000, 500000),
		TotalTime:    randomNumber(50000, 300000),
		ErrTimestamp: 0,
		ErrFile:      0,
		ErrLine:      0,
		Errcode:      0,
		PicCrc: int64(randomNumber(500000000, 700000000)),
		FwCrc:        randomNumber(1000000000, 2000000000),
    }

	b, e := json.Marshal(eslDatabase)

	if e != nil {
		return nil, e
	}

    message := fmt.Sprintf("Database ESL %d Status {'Esl': {'%d': %s }}", esl, esl, ReplaceSingleQuotes(string(b)))

	payload := P{
		Timestamp: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Esl: esl,
		LogType: "ray",
		Machine: Machine{Hostname: "DESKTOP-IBVTCQR"},
		Level: "DEBUG",
		ReadAt: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Source: "/home/arthur/2.log",
		EslDatabaseStatus: eslDatabase,
		Type: "common",
		Offset: randomNumber(1, 3000000),
		Message: message,
	}

	log.Printf("%+v", payload)

	buf := &bytes.Buffer{}
	err := json.NewEncoder(buf).Encode(&payload)
	return buf, err
}

func genAnomalyLog(when time.Time) (*bytes.Buffer, error) {
	esl := getRandomEsl()

	message := fmt.Sprintf("Database ESL %d Status {}", esl)

	payload := PWD{
		Timestamp: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Esl: esl,
		LogType: "ray",
		Machine: Machine{Hostname: "DESKTOP-IBVTCQR"},
		Level: "DEBUG",
		ReadAt: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Source: "/home/arthur/2.log",
		Offset: randomNumber(1, 3000000),
		Message: message,
		AnomalyCategory: "emptyStatus",
	}

	log.Printf("%+v", payload)

	buf := &bytes.Buffer{}
	err := json.NewEncoder(buf).Encode(&payload)
	return buf, err
}

var levels = []string{
"INFO",
"ERROR",
"WARNING",
"DEBUG",
}

var accessMessages = []string{
	"star.api.external.v1.endpoints.picture:send_picture:25 - Get picture for send to %d",
	"star.services.picture:send_to_esl:107 - Picture for %d was not sent to cluster, cluster is not unknown",
	"star.services.shared:cluster_management_loop:20 - Check esls",
	"star.api.external.v1.endpoints.picture:send_picture:25 - Get picture for send to %d",
}

func genRandomAccessMessage(esl int) string {
	return fmt.Sprintf(accessMessages[rand.Int() % len(accessMessages)], esl)
}

var driverMessages = []string{
	"STATUS: from esl: %d, 720 (rssi: 64)",
	"HTTP: get list of cases",
	"INIT: send settings to ESL: %d, 1201",
}

func genRandomDriverMessage(esl int) string {
	return fmt.Sprintf(driverMessages[rand.Int() % len(driverMessages)], esl)
}

func genRandomDriverLog(when time.Time)  (*bytes.Buffer, error)  {
	level := levels[rand.Int() % len(levels)]
	esl := getRandomEsl()
	message := genRandomDriverMessage(esl)

	payload := PW{
		Timestamp: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Esl: esl,
		LogType: "driver",
		Machine: Machine{Hostname: "DESKTOP-IBVTCQR"},
		Level: level,
		ReadAt: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Source: "/home/arthur/2.log",
		Offset: randomNumber(1, 3000000),
		Message: message,
	}

	log.Printf("%+v", payload)

	buf := &bytes.Buffer{}
	err := json.NewEncoder(buf).Encode(&payload)
	return buf, err
}

func genAccessLog(when time.Time)  (*bytes.Buffer, error) {
	level := levels[rand.Int() % len(levels)]
	esl := getRandomEsl()
	message := genRandomAccessMessage(esl)
	
	payload := PW{
		Timestamp: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Esl: esl,
		LogType: "access",
		Machine: Machine{Hostname: "DESKTOP-IBVTCQR"},
		Level: level,
		ReadAt: when.UTC().Format("2006-01-02T15:04:05-0700"),
		Source: "/home/arthur/2.log",
		Offset: randomNumber(1, 3000000),
		Message: message,
	}

	log.Printf("%+v", payload)

	buf := &bytes.Buffer{}
	err := json.NewEncoder(buf).Encode(&payload)
	return buf, err
}

func genPayload(when time.Time) (*bytes.Buffer, error) {
	switch randomNumber(0, 10) {
	case 0:
		return genEslDatabase(when)
	case 1:
		return genAccessLog(when)
	case 2:
		return genRandomDriverLog(when)
	case 3:
		return genAnomalyLog(when)
	case 4:
		return genEslDatabase(when)
	case 5:
		return genEslDatabase(when)
	}
	return genEslDatabase(when)
}


func randomNumber(min int, max int) int {
    return rand.Intn(max - min) + min
}
