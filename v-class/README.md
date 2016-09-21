
## 操作步驟

請依照下面順序操作。

### 下載資源檔

執行下面指令，下載資源檔。

``` sh
$ ./download.sh
```

主要會產生

* data/CNS_phonetic.txt
* data/CNS2UNICODE_Unicode_2.txt
* data/CNS2UNICODE_Unicode_15.txt
* data/CNS2UNICODE_Unicode_BMP.txt

註：原本就有存在下面這個檔

* data/CNS_phonetic.txt

### 轉檔

執行下面指令，會執行轉檔的動作。

``` sh
$ ./cin.js
```

執行完畢後，會產生幾個檔案

* CnsPhonetic.cin (cin檔)
* CnsPhonetic.csv (對照cin檔，除錯用，有多餘的相關資訊)
* InvalidPhonetic.csv (非合法注音列表)
* CollisionList.csv (重複的「phonetic - unicode」)


### 觀看「CnsPhonetic.cin」

執行下面指令，觀看「CnsPhonetic.cin」這個檔的內容

``` sh
$ less CnsPhonetic.cin
```

也可以執行下面指令，計算「CnsPhonetic.cin」這個檔的行數。

``` sh
$ wc -l CnsPhonetic.cin
```


## 相關專案

* [https://github.com/samwhelp/prototype-cns11643-to-cin](https://github.com/samwhelp/prototype-cns11643-to-cin)
* [https://github.com/samwhelp/CinConvert](https://github.com/samwhelp/CinConvert)
