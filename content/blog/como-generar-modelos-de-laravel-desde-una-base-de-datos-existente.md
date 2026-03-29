---
title: "Cómo generar modelos de Laravel desde una base de datos existente"
date: "2021-04-23T00:36:17.739Z"
description: "Exploremos un mecanismo para generar modelos de Laravel desde nuestra base de datos existente. Súper útil al migrar proyectos existentes hacia Laravel."
image: "/img/reliese-laravel-cover.png"
og: "/img/og/reliese-laravel-blog.png"
---

${toc}
## Instalación

En un proyecto existente de Laravel agreguemos el paquete [reliese/laravel](https://github.com/reliese/laravel) como una dependencia solo para nuestro entorno de desarrollo

```bash
composer require reliese/laravel --dev
```

Ahora hay que publicar el archivo de configuraciones

```bash
php artisan vendor:publish --tag=reliese-models
```

## Uso

¡Ahora sí!

Espera un momento, primero lo primero: Hay que [configurar nuestra base de datos](https://laravel.com/docs/8.x/database#configuration).

Ahora sí

```bash
php artisan code:models
```

## Ya tengo mis modelos

```php
<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class User extends Model
{
	protected $table = 'users';

	protected $dates = [
		'email_verified_at'
	];

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'name',
		'email',
		'email_verified_at',
		'password',
		'remember_token'
	];
}
```

Incluyen

* Los property type hints que nos ayudan con el autocompletado
* El nombre de la tabla (`table`)
* La fechas que serán convertidas a instancias de Carbon (`dates`)
* Los campos protegidos (`hidden`) que no se mostrarán al convertir el model en array
* Los campos asignables (`fillable`)

```php
$user = new \App\Models\User();

$user->created_at->diffForHumans();
```

## ¿Y si agrego nuevas tablas?

```bash
php artisan make:migration create_posts_table
```

Y agrego una relación

```php
Schema::create('posts', function (Blueprint $table) {
		$table->id();
    $table->foreignIdFor(\App\Models\User::class)
        ->constrained()
        ->onDelete('cascade');
    $table->string('title');
    $table->text('body');
    $table->boolean('visible');
    $table->dateTime('publication_date');
    $table->softDeletes(); // Estamos habilitado los soft deletes
    $table->timestamps();
});
```

Creemos la tabla

```bash
php artisan migrate
```

Volvamos a generar nuestros modelos

```bash
php artisan code:models
```

Vemos el modelo generado

```php
<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Post
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $body
 * @property bool $visible
 * @property Carbon $publication_date
 * @property string|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property User $user
 *
 * @package App\Models
 */
class Post extends Model
{
	use SoftDeletes;
	protected $table = 'posts';

	protected $casts = [
		'user_id' => 'int',
		'visible' => 'bool'
	];

	protected $dates = [
		'publication_date'
	];

	protected $fillable = [
		'user_id',
		'title',
		'body',
		'visible',
		'publication_date'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
```

Se agregó el trait de `SoftDeletes` a la tabla posts

Y podemos ver que tenemos la lista de `castings`

* bool
* int

El modelo User también fue actualizado con su relación `hasMany` y un nuevo property type hint que nos ayudará con el autocompletado para la relación con los `posts`

```php
<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Collection|Post[] $posts
 *
 * @package App\Models
 */
class User extends Model
{
	protected $table = 'users';

	protected $dates = [
		'email_verified_at'
	];

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'name',
		'email',
		'email_verified_at',
		'password',
		'remember_token'
	];

	public function posts()
	{
		return $this->hasMany(Post::class);
	}
}
```

Ahora el User tiene la relación con los posts y gracias los type hints tenemos autocompletado

```php
$user = new User();

foreach ($user->posts as $post) {
		// El IDE nos autocompletará después de la flecha
    $post->
}
```

## ¿Y si quiero agregar métodos y cambiar algo en mis modelos?

Para esto podemos habilitar los `base_models` en el archivo de configuración
