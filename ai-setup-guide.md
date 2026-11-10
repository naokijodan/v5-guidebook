# AIに渡すセットアップ指示書
## 一括登録シートV5 ― Google Sheets MCP 設定ガイド

---

## ▼ まずここを読んでください（人間向け・30秒）

この文書は、あなたの代わりにAIがすべての設定作業を行うための指示書です。

**あなたがやるのは、ログインと許可ボタンとパスワード入力だけです。**

- Googleなどへのログイン
- 「許可」「承認」「Allow」のボタン（AIツールの実行許可、パソコンの許可ダイアログなど）
- パソコンのパスワード入力（求められたときだけ）

インストール、鍵の作成、MCPの登録、シートの共有、スキル本文の取得と登録、動作確認は、すべてAIがやります。

**使うGoogleアカウントについて**

個人のGoogleアカウント（gmail.com）を使ってください。会社のGoogle Workspaceアカウントは、組織のセキュリティポリシーによって鍵の作成が禁止されている場合があります。

**セキュリティについて（重要）**

このあとAIがJSONファイル（鍵ファイル）を作ります。これはパスワードと同じ大切なファイルです。GitHubやSNS・チャットに貼らない、他人に渡さないよう注意してください。

---

## ▼ ここからはAIへの指示です（AIが読んで実行する）

---

# AI実行指示書：Google Sheets MCP セットアップ

## 【絶対ルール】（すべてのステップより優先）

1. **人に頼んでよいのは「ログイン」「承認・許可ボタン」「パスワード入力」だけ。** 画面のクリックや入力、コピー貼り付け、ファイル移動、コマンド実行を人に頼まない。自分でやる。
   - 例外：MCP登録の反映にツールの再起動が必要な場合だけ、再起動（アプリを閉じて開き直す／新しい会話を開く）は人に頼んでよい。
2. **推測で進めない。** 公式ドキュメントで確かめてから実行する。
3. **1回に頼む操作は1つ。** 何をどこで押せばよいかを具体的に伝える。
4. **失敗したら同じことを繰り返さず、状況を報告する。** 勝手に別の方法へ切り替えない。

## 【全体ゴール】

mcp-gsheets（サービスアカウント方式）を自分のツールに登録し、ユーザーの一括登録シートV5スプレッドシートへ書き込める状態にする。さらに、シートから翻訳スキル本文を取得して自分のツールにスキルとして登録する。

## 【最初にユーザーへ聞くこと】

聞くのは次の1つだけです（まだ受け取っていない場合のみ）。

> 翻訳に使うスプレッドシートのURLを教えてください。

## 【対応ツールと例外】

- **おすすめ：Codex アプリ、Claude Code（Chrome拡張 Claude in Chrome あり）。** ブラウザ操作ができるため、全手順をAIだけで進められる。
- **Codex CLI / Gemini CLI** は標準ではブラウザ操作ができない。**ブラウザが必要な2手順（ステップE：シートの共有、ステップF：スキル本文の取得）だけは、例外として人に「この1つを押してください」と1手ずつ頼んでよい。** 頼むときも絶対ルールの3（1回に1操作・具体的に）を守る。

---

## ステップA：自己診断（最初に必ず実行）

作業を始める前に、以下を確認して内容を報告してください。

1. **自分のツール種別**
   - Claude Code（`claude`コマンド）
   - Gemini CLI（`gemini`コマンド）
   - Codex CLI（`codex`コマンド）
   - Codex App（GUIアプリ）
   - それ以外

   あわせて、**ブラウザを自分で操作できるか**（Claude in Chrome などが使えるか）を確認する。

2. **OS**
   - Mac（macOS）
   - Windows
   - Linux

3. **以下のコマンドが使えるか確認する**

   Macの場合：
   ```bash
   which gcloud 2>/dev/null && echo "gcloud: あり" || echo "gcloud: なし"
   which node 2>/dev/null && echo "node: あり" || echo "node: なし"
   which npx 2>/dev/null && echo "npx: あり" || echo "npx: なし"
   ```

   Windowsの場合（PowerShell）：
   ```powershell
   (Get-Command gcloud -ErrorAction SilentlyContinue) | ForEach-Object { "gcloud: あり" } | Out-Default
   if (-not $?) { "gcloud: なし" }
   (Get-Command node -ErrorAction SilentlyContinue) | ForEach-Object { "node: あり" } | Out-Default
   if (-not $?) { "node: なし" }
   ```

確認結果をユーザーに報告してから次のステップに進んでください。

---

## ステップB：足りない道具をAIが入れる

ステップAで「なし」だったものを、AIが自分で入れます。人に頼むのは、パスワードを聞かれたときの入力と、許可ダイアログのボタンだけです。入れる前に、必ず公式ドキュメントで最新の手順を確認してください。

### gcloud（Google Cloud CLI）

公式: https://cloud.google.com/sdk/docs/install

- **Mac：** 公式ページの手順どおり、お使いのCPUに合った tar.gz をダウンロードして展開し、ホームフォルダ配下（例：`~/google-cloud-sdk`）で `./google-cloud-sdk/install.sh` を実行する。PATHへの追加も案内に従ってAIが行い、新しいシェルで `gcloud --version` が動くことを確認する。
- **Windows：** 公式ページにある Windows 用インストーラ（GoogleCloudSDKInstaller.exe）をダウンロードして実行する。許可ダイアログが出たら人に「許可」を押してもらう。

### Node.js

nodejs.org の公式ページを読んで、その手順で入れる。入れたあと `node --version` と `npx --version` が動くことを確認する。

### パスワードについて

インストール中にパソコンのパスワードを聞かれたら、人に「パソコンのパスワードを入力してください」とだけ頼む。パスワードの内容はAIが見たり記録したりしない。

---

## ステップC：サービスアカウントと鍵ファイルを作成する

以下を順番に実行してください。`[PROJECT_ID]`は自分で名前を決めます（例：`sheets-mcp-myname`）。英小文字・数字・ハイフンのみ使用可、6〜30文字。`gcloud auth login` ではブラウザが開くので、Googleのログイン画面が出たら人にログインだけ頼みます。

```bash
# 1. Googleアカウントにログイン（ブラウザが開く → ユーザーが承認する）
gcloud auth login

# 2. プロジェクトを作成
gcloud projects create [PROJECT_ID]

# 3. 作成したプロジェクトを使用中に設定
gcloud config set project [PROJECT_ID]

# 4. Google Sheets APIを有効化（Drive APIは不要）
gcloud services enable sheets.googleapis.com

# 5. サービスアカウントを作成（名前は sheets-mcp で統一）
gcloud iam service-accounts create sheets-mcp --display-name="Sheets MCP"

# 6. 鍵ファイルを生成・保存
# Mac/Linux:
mkdir -p ~/.config/gcp
gcloud iam service-accounts keys create ~/.config/gcp/sheets-mcp-credentials.json \
  --iam-account=sheets-mcp@[PROJECT_ID].iam.gserviceaccount.com
chmod 600 ~/.config/gcp/sheets-mcp-credentials.json
```

Windowsの場合、鍵の保存先は以下を使ってください（`名前`は実際のユーザー名に置き換え）：
```
C:\Users\名前\sheets-mcp-key.json
```

対応するコマンド（PowerShell）：
```powershell
gcloud iam service-accounts keys create "C:\Users\$env:USERNAME\sheets-mcp-key.json" `
  --iam-account=sheets-mcp@[PROJECT_ID].iam.gserviceaccount.com
```

---

## ステップD：google-sheets MCPをAIのツールに登録する

ステップAで確認したツール種別に合わせて実行してください。`<鍵パス>` と `<ProjectID>` は実際の値に置き換えます。

---

### Claude Code CLI の場合

> 公式リファレンス: https://code.claude.com/docs/en/mcp

**重要な構文ルール（公式ドキュメントに明記）：**
`--env` フラグの直後にサーバー名を置くと、CLIがサーバー名を環境変数のペアとして読み取り拒否します。`--env` と サーバー名の間には、必ず `--transport stdio` などの別オプションを挟んでください。`--` (ダブルダッシュ) の後がサーバーの実行コマンドです。

```bash
claude mcp add --scope user \
  --env GOOGLE_APPLICATION_CREDENTIALS=<鍵パス> \
  --env GOOGLE_PROJECT_ID=<ProjectID> \
  --transport stdio \
  google-sheets \
  -- npx -y mcp-gsheets@latest
```

設定は `~/.claude.json`（userスコープ）に保存されます。

**登録確認：**
```bash
claude mcp list
```

---

### Gemini CLI の場合

> 公式リファレンス: https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md

**重要な構文ルール（公式ドキュメントに明記）：**
`gemini mcp add` では `--` 区切りは不要です。`--transport stdio` はデフォルトのため省略できます。構文は `gemini mcp add [options] <name> <command> [args...]` です。

```bash
gemini mcp add --scope user \
  -e GOOGLE_APPLICATION_CREDENTIALS=<鍵パス> \
  -e GOOGLE_PROJECT_ID=<ProjectID> \
  google-sheets npx -y mcp-gsheets@latest
```

**または `~/.gemini/settings.json` に直接記述する方法（公式に記載あり）：**

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "npx",
      "args": ["-y", "mcp-gsheets@latest"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "<鍵パス>",
        "GOOGLE_PROJECT_ID": "<ProjectID>"
      }
    }
  }
}
```

---

### Codex CLI の場合

> 公式リファレンス: https://developers.openai.com/codex/config-reference

設定ファイル `~/.codex/config.toml` を開き、以下を末尾に追記してください（既存の内容は消さないこと）。

**Mac/Linux：**
```toml
[mcp_servers.google-sheets]
command = "npx"
args = ["-y", "mcp-gsheets@latest"]

[mcp_servers.google-sheets.env]
GOOGLE_APPLICATION_CREDENTIALS = "/Users/名前/.config/gcp/sheets-mcp-credentials.json"
GOOGLE_PROJECT_ID = "<ProjectID>"
```

**Windows：**

公式ドキュメントおよびMCP公式の例では、Windowsでも `command = "npx"` のまま記述しています（`cmd /c` でのラップは公式には記載されていません）。

```toml
[mcp_servers.google-sheets]
command = "npx"
args = ["-y", "mcp-gsheets@latest"]

[mcp_servers.google-sheets.env]
GOOGLE_APPLICATION_CREDENTIALS = "C:\\Users\\名前\\sheets-mcp-key.json"
GOOGLE_PROJECT_ID = "<ProjectID>"
```

**Windowsで `npx` が起動に失敗する場合の回避策（公式記載ではなく、コミュニティで報告されている方法）：**

Windowsで `npx` を直接 `command` に指定すると起動しないケースが報告されています。その場合は `cmd /c` でラップする方法が回避策として使われています。ただしこれは公式手順ではありません。

```toml
[mcp_servers.google-sheets]
command = "cmd"
args = ["/c", "npx", "-y", "mcp-gsheets@latest"]

[mcp_servers.google-sheets.env]
GOOGLE_APPLICATION_CREDENTIALS = "C:\\Users\\名前\\sheets-mcp-key.json"
GOOGLE_PROJECT_ID = "<ProjectID>"
```

まず公式の `npx` のままで試し、動作しない場合に上記の回避策を試してください。

---

### Codex App（GUIアプリ）の場合

※ **Unknown（未確認）：** Codex Appの設定が画面上の設定メニュー（Settings / Plugins）から行えるか、または `~/.codex/config.toml` を直接書き換えることで反映されるかは確認できていません。バージョンによって異なる可能性があります。

以下の両方を試してください：

**方法1：config.toml を直接編集**
上記「Codex CLI の場合」と同じ内容を `~/.codex/config.toml` に追記する。アプリを再起動して反映を確認する。

**方法2：アプリの設定画面から登録**
アプリ内の Settings または Plugins（プラグイン）メニューを探し、MCPサーバーの追加項目があれば以下の情報を入力する：
- サーバー名：`google-sheets`
- コマンド：`npx`
- 引数：`-y mcp-gsheets@latest`
- 環境変数：`GOOGLE_APPLICATION_CREDENTIALS=<鍵パス>`、`GOOGLE_PROJECT_ID=<ProjectID>`

画面の表示に従って判断してください。

---

### Windowsで claude / gemini の add コマンドを使う場合の注意

`claude mcp add` や `gemini mcp add` コマンドが内部で `cmd /c` のラップを自動で行うかどうかは **Unknown（未確認）** です。コマンドで登録した後に動作確認（ステップG）が失敗した場合は、設定ファイルを直接開いて `cmd /c` ラップへの書き直しを検討してください（上記「Codex CLI の場合」の回避策を参照）。

---

## ステップE：スプレッドシートの共有（AIがブラウザで操作）

### E-1：サービスアカウントのメールアドレスを取り出す

鍵ファイル（JSON）をAIが直接開き、`"client_email"` の値を読み取る。

```json
{
  "type": "service_account",
  "project_id": "...",
  "client_email": "sheets-mcp@[PROJECT_ID].iam.gserviceaccount.com",
  ...
}
```

Windows（PowerShell）：
```powershell
(Get-Content "<鍵パス>" | ConvertFrom-Json).client_email
```

### E-2：AIがブラウザでシートを共有する（ブラウザ操作ができるツール）

1. ユーザーから受け取ったスプレッドシートのURLをブラウザで開く。
2. 右上の「共有」を押す。
3. 入力欄に `client_email` を入力する。
4. 権限を「編集者」にする。
5. 「送信」（または「完了」）を押す。

Googleのログイン画面が出たら、人に**ログインだけ**頼む。ログイン後は続きをAIがやる。

### E-3：ブラウザ操作ができないツール（Codex CLI / Gemini CLI）の場合

例外として、1手ずつ人に頼む。1回に頼むのは1操作だけ。

1. 「このURLをブラウザで開いてください：（シートのURL）」
2. 「右上の『共有』を押してください」
3. 「入力欄に次のメールアドレスを貼り付けてください：（client_email）」
4. 「権限を『編集者』にして『送信』を押してください」

各操作が終わったと返事があってから次を頼む。

> gcloud でDrive権限付きログインをしてコマンドで共有する方法は、確実でないため使わない。

---

## ステップF：翻訳スキルの取得と登録

### F-1：スキル本文を取得する（ブラウザ操作ができるツールは自分でやる）

1. ステップEと同じスプレッドシートをブラウザで開く。
2. メニュー「🌐 eBay 翻訳 (AI)」→「📄 スキル本文をダウンロード」を開く。
3. 「📋 クリップボードにコピー」または「📥 ファイルとしてダウンロード」で本文を取得する。
4. 同じ画面にある「最終チェック文をダウンロード（ebay-final-check.txt）」も保存する。

Googleのログイン画面や許可ダイアログが出たら、人にログイン・許可だけ頼む。

Codex CLI / Gemini CLI の場合は、例外として人に1手ずつ頼む（例：「メニュー『🌐 eBay 翻訳 (AI)』を開いてください」→「『📄 スキル本文をダウンロード』を押してください」→「『📥 ファイルとしてダウンロード』を押してください。保存先を教えてください」）。

### F-2：スキルとして登録する（AIが自分でやる）

本文の中にある次の行を探す。

```
===（ここから下をコピーしてスキルに登録）===
```

**この行より下だけ**を、自分のツールのスキルとして登録する。上は人向けの変更履歴なので登録しない。

| ツール | 登録先 |
|--------|--------|
| Codex app | Skills 設定で新規Skillを作成し、本文を登録 |
| Claude Code | `~/.claude/skills/ebay-translation/SKILL.md` に保存 |
| Codex CLI | Unknown：Codex の公式ドキュメント（Skills）を読んで、その場所に登録する |
| Gemini CLI | 公式ドキュメントを読んで、skill の登録場所に登録する |

ebay-final-check.txt は、翻訳のあとの再チェックに使うので、保存場所をユーザーに報告する。

---

## ステップG：動作確認

MCP登録の反映にツールの再起動が必要な場合だけ、再起動（アプリを閉じて開き直す／新しい会話を開く）は人に頼んでよい例外です（Claude Code / Gemini CLI は再起動または新セッション、Codex CLI / Codex App は終了して再起動）。

**再開のしかた：** 再起動後、ユーザーには最初と同じ1文をもう一度貼ってもらう。AIはステップAで、gcloud・鍵ファイル・MCP登録・共有・スキル登録が済んでいるかを先に確かめ、済んでいる手順は飛ばして、ここ（ステップGの動作確認）から続ける。

### 動作確認を実行する

1. **メタデータ取得**：google-sheets MCPを使って、対象スプレッドシートのシート名一覧を取得する。

2. **テスト書き込み**：ユーザーのデータを壊さないよう、以下の安全な場所に書き込む。
   - シートの末尾の空行（データが入っている最終行の次の行）を使う。
   - 末尾の空行が見つからない場合は、「確認用」という名前のシートを1枚追加してそのA1セルを使う。
   - 書き込む内容：「MCP接続テスト OK」

3. **読み戻し確認**：同じセルの値を読み取り、書き込んだ内容と一致するか確認する。

4. **テスト内容を削除する**：書き込んだセルの内容を空文字列で上書きして消す。追加したシートがあれば削除する。

成功した場合はユーザーに報告してください。

### 失敗した場合の主な原因

| エラー・症状 | 主な原因 | 対処 |
|-------------|---------|------|
| `unknown_action` / MCPが見つからない | MCP未接続（登録未完了 or 再起動未実施） | ステップDを再確認し、ツールを再起動する |
| `401 Unauthorized` | 鍵ファイルのパスが間違っている、または鍵ファイルが壊れている | 鍵パスを確認し、ファイルが存在するか確認する |
| `403 Forbidden` | シートの共有設定が未完了、または権限が「閲覧者」になっている | ステップEの共有を「編集者」でやり直す |
| `404 Not Found` | スプレッドシートIDが間違っている | URLの `/d/` と `/edit` の間の文字列がIDであることを確認する |

---

## 完了報告のテンプレート（AIがユーザーに伝える）

```
✅ セットアップが完了しました

【設定内容】
- プロジェクトID：[PROJECT_ID]
- サービスアカウント：[client_email]
- 鍵ファイルの場所：[鍵パス]
- MCPサーバー名：google-sheets
- 翻訳スキル：登録済み（[登録先]）
- 最終チェック文：保存済み（[保存場所]）

【確認結果】
- メタデータ取得：成功
- テスト書き込み：成功
- 読み戻し確認：成功

これで一括登録シートV5からスプレッドシートへの書き込みが使えます。
```

---

*このセットアップ手順書は「一括登録シートV5」配布ユーザー向けのものです。*
*鍵ファイルはパスワードと同等の機密情報です。GitHubやSNS・チャット・メールに貼らないでください。*
