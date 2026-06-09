# AIに渡すセットアップ指示書
## 一括登録シートV5 ― Google Sheets MCP 設定ガイド

---

## ▼ まずここを読んでください（人間向け・1分）

この文書は、あなたの代わりにAIがすべての設定作業を行うための指示書です。

**基本はやることが3つです。環境によって増えることがあります**

| # | 作業 | 難易度 |
|---|------|--------|
| 1 | この文書全体をコピーして、自分のAI（Claude Code / Codex / Gemini）に貼り付ける | ★☆☆ |
| 2 | ブラウザが開いたらGoogleアカウントでログインして承認する | ★☆☆ |
| 3 | AIが教えてくれるメールアドレスを、翻訳に使うスプレッドシートの「共有」に貼って「編集者」にする | ★☆☆ |

**環境によって増える可能性がある作業**

- gcloud（Google公式ツール）やNode.jsがパソコンに入っていない場合、AIがインストールの案内をすることがあります。画面の指示に従ってください。
- AIがコマンドを実行するたびに「許可しますか？」と聞いてくる場合は、その都度「はい（Allow）」を選んでください。

**使うGoogleアカウントについて**

個人のGoogleアカウント（gmail.com）を使ってください。会社のGoogle Workspaceアカウントは、組織のセキュリティポリシーによって鍵の作成が禁止されている場合があります。

**セキュリティについて（重要）**

このあとAIがJSONファイル（鍵ファイル）を作ります。これはパスワードと同じ大切なファイルです。GitHubやSNS・チャットに貼らない、他人に渡さないよう注意してください。

---

---

## ▼ ここからはAIへの指示です（AIが読んで実行する）

---

# AI実行指示書：Google Sheets MCP セットアップ

## 【全体ゴール】

mcp-gsheets（サービスアカウント方式）を自分のツールに登録し、ユーザーの一括登録シートV5スプレッドシートへの書き込みができる状態にする。

---

## ステップA：自己診断（最初に必ず実行）

作業を始める前に、以下を確認して内容を報告してください。

1. **自分のツール種別**
   - Claude Code CLI（`claude`コマンド）
   - Gemini CLI（`gemini`コマンド）
   - Codex CLI（`codex`コマンド）
   - Codex App（GUIアプリ）
   - それ以外

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

## ステップB：サービスアカウントと鍵ファイルを作成する

### gcloudがある場合（コマンドで自動作成）

以下を順番に実行してください。`[PROJECT_ID]`は自分で名前を決めます（例：`sheets-mcp-myname`）。英小文字・数字・ハイフンのみ使用可、6〜30文字。

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

### gcloudがない場合（Google Cloud Consoleの画面で手動作成）

AIはユーザーに以下の手順を1ステップずつ案内してください。ユーザーがブラウザで作業し、各ステップ完了後に「できました」と報告したら次の案内に進みます。

**ブラウザで開くURL：** https://console.cloud.google.com/

**手順（日本語UI）：**

1. **プロジェクトを作成する**
   - 画面左上のプロジェクト選択欄をクリック → 「新しいプロジェクト」
   - プロジェクト名を入力（例：Sheets MCP）→「作成」
   - 作成完了後、そのプロジェクトを選択した状態にする

2. **Google Sheets APIを有効にする**（Drive APIは不要です）
   - 左メニュー：「APIとサービス」→「ライブラリ」
   - 検索欄に「Google Sheets API」と入力して選択
   - 「有効にする」ボタンをクリック

3. **サービスアカウントを作成する**
   - 左メニュー：「IAMと管理」→「サービスアカウント」
   - 「サービスアカウントを作成」をクリック
   - サービスアカウント名：`sheets-mcp`（任意）→「作成して続行」
   - ロールの付与は省略して「完了」

4. **鍵ファイル（JSON）をダウンロードする**
   - 作成したサービスアカウントの行をクリック
   - 「キー」タブ → 「鍵を追加」→「新しい鍵を作成」
   - 形式「JSON」を選択 → 「作成」
   - JSONファイルが自動的にダウンロードされる

5. **ダウンロードしたファイルを安全な場所に移動する**
   - Macの場合：`~/.config/gcp/sheets-mcp-credentials.json` に移動し、Terminalで `chmod 600 ~/.config/gcp/sheets-mcp-credentials.json` を実行
   - Windowsの場合：`C:\Users\名前\sheets-mcp-key.json` に移動

---

## ステップC：google-sheets MCPをAIのツールに登録する

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

`claude mcp add` や `gemini mcp add` コマンドが内部で `cmd /c` のラップを自動で行うかどうかは **Unknown（未確認）** です。コマンドで登録した後に動作確認（ステップE）が失敗した場合は、設定ファイルを直接開いて `cmd /c` ラップへの書き直しを検討してください（上記「Codex CLI の場合」の回避策を参照）。

---

## ステップD：サービスアカウントのメールアドレスをユーザーに伝える

鍵ファイル（JSON）の中の `client_email` を読み取り、ユーザーに以下の形式で伝えてください。

**`client_email` の取得方法：**

鍵ファイルはJSONテキストファイルです。AIが直接そのファイルを開いて `"client_email"` の行を読み取ってください。形式は以下のようになっています：

```json
{
  "type": "service_account",
  "project_id": "...",
  "client_email": "sheets-mcp@[PROJECT_ID].iam.gserviceaccount.com",
  ...
}
```

Windowsで確認したい場合（PowerShell）：
```powershell
(Get-Content "<鍵パス>" | ConvertFrom-Json).client_email
```

取得したアドレスをユーザーに以下の形式で伝えてください：

```
📋 スプレッドシートの共有設定をお願いします

以下のメールアドレスを、翻訳に使うスプレッドシートの「共有」に追加して、
権限を「編集者」にしてください。

  [ここにclient_emailの値を表示]

手順：
1. スプレッドシートを開く
2. 右上の「共有」ボタンをクリック
3. 上のメールアドレスを貼り付ける
4. 権限を「編集者」にして「送信」または「完了」をクリック

完了したら教えてください。
```

---

## ステップE：動作確認

ユーザーがシートの共有設定を完了したら、以下を実行してください。

### 再起動の要否を確認して案内する

- **Claude Code CLI**：ターミナルで `claude` を再起動するか、新しいセッションを開始する。
- **Gemini CLI**：同様に再起動する。
- **Codex CLI / Codex App**：アプリを一度終了して再起動する。

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
| `unknown_action` / MCPが見つからない | MCP未接続（登録未完了 or 再起動未実施） | ステップCを再確認し、ツールを再起動する |
| `401 Unauthorized` | 鍵ファイルのパスが間違っている、または鍵ファイルが壊れている | 鍵パスを確認し、ファイルが存在するか確認する |
| `403 Forbidden` | シートの共有設定が未完了、または権限が「閲覧者」になっている | ステップDのメールアドレスを「編集者」で共有し直す |
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

【確認結果】
- メタデータ取得：成功
- テスト書き込み：成功
- 読み戻し確認：成功

これで一括登録シートV5からスプレッドシートへの書き込みが使えます。
```

---

*このセットアップ手順書は「一括登録シートV5」配布ユーザー向けのものです。*
*鍵ファイルはパスワードと同等の機密情報です。GitHubやSNS・チャット・メールに貼らないでください。*
